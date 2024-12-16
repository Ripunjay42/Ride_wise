//scheduleController.js
const { PNR, Schedule, Driver, Passenger, sequelize } = require('../models');
const { sendEmail, generatePassengerEmail, generateDriverEmail, generateRideCompletionPassengerEmail, generateRideCompletionDriverEmail } = require('../utils/emailService');
const { Op } = require('sequelize');

// Generate OTP email content
const generateOtpEmail = (otp, driverName) => {
  const subject = 'Ride Completion OTP';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Ride Completion Verification</h2>
      <p>Dear Passenger,</p>
      <p>Your driver ${driverName} has initiated the ride completion process.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin: 0; color: #333; text-align: center;">Your OTP</h3>
        <p style="font-size: 32px; font-weight: bold; text-align: center; margin: 10px 0; letter-spacing: 5px;">
          ${otp}
        </p>
        <p style="color: #666; text-align: center; margin: 0;">
          This OTP will expire in 5 minutes
        </p>
      </div>

      <p>Please share this OTP with your driver to complete the ride.</p>
      <p>If you didn't request this OTP, please contact our support team immediately.</p>
    </div>
  `;

  return { subject, html };
};

const sendOtp = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { scheduleId } = req.params;

    // Find the schedule with driver details
    const schedule = await Schedule.findOne({
      where: { 
        id: scheduleId,
        status: 'busy'  // Only allow OTP generation for ongoing rides
      },
      include: [{
        model: Driver,
        as: 'driver',
        attributes: ['firstName', 'lastName']
      }],
      transaction
    });

    if (!schedule) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'No active ride found for this schedule'
      });
    }

    // Find the PNR record with passenger details
    const pnr = await PNR.findOne({
      where: { 
        scheduleId,
        status: 'active'
      },
      include: [{
        model: Passenger,
        as: 'passenger',
        attributes: ['email', 'firstName', 'lastName']
      }],
      transaction
    });

    if (!pnr) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'No active booking found for this schedule'
      });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes from now

    // Update PNR with OTP details
    await pnr.update({
      otp,
      otpExpiresAt,
      otpAttempts: 0  // Reset attempts when generating new OTP
    }, { transaction });

    // Send OTP email
    const driverName = `${schedule.driver.firstName} ${schedule.driver.lastName}`;
    const emailContent = generateOtpEmail(otp, driverName);
    
    await sendEmail(pnr.passenger.email, emailContent);

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to passenger email'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error in sendOtp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const verifyOtp = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { scheduleId } = req.params;
    const { otp, pnrId } = req.body;

    // Validate input
    if (!otp || !pnrId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'OTP and PNR ID are required'
      });
    }

    // Find PNR record
    const pnr = await PNR.findOne({
      where: {
        PNRid: pnrId,
        scheduleId,
        status: 'active'
      },
      include: [
        { model: Passenger, as: 'passenger' },
        { model: Driver, as: 'driver' }
      ],
      transaction
    });

    if (!pnr) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if OTP is expired
    if (new Date() > pnr.otpExpiresAt) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check OTP attempts
    if (pnr.otpAttempts >= 3) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Maximum OTP attempts exceeded. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (pnr.otp !== otp) {
      await pnr.increment('otpAttempts', { transaction });
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Update PNR and Schedule status
    await Promise.all([
      pnr.update({
        status: 'completed',
        otp: null,
        otpExpiresAt: null,
        completedAt: new Date()
      }, { transaction }),
      
      Schedule.update(
        { 
          status: 'completed',
          completedAt: new Date()
        },
        { 
          where: { id: scheduleId },
          transaction
        }
      )
    ]);

    // Commit transaction
    await transaction.commit();

    // Send ride completion emails to passenger and driver
    const passengerCompletionEmailContent = generateRideCompletionPassengerEmail(pnr, pnr.driver);
    const driverCompletionEmailContent = generateRideCompletionDriverEmail(pnr, pnr.passenger);

    const passengerCompletionEmailSent = await sendEmail(pnr.passenger.email, passengerCompletionEmailContent);
    const driverCompletionEmailSent = await sendEmail(pnr.driver.email, driverCompletionEmailContent);

    // Log email status
    console.log('Passenger completion email sent:', passengerCompletionEmailSent);
    console.log('Driver completion email sent:', driverCompletionEmailSent);

    res.status(200).json({
      success: true,
      message: 'Ride completed successfully, and emails sent to both passenger and driver'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error in verifyOtp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const addSchedule = async (req, res) => {
  try {
    const { 
      driverId,
      pickupLocation,
      dropoffLocation,
      date,
      timeFrom,
      timeTo,
      status
    } = req.body;

    console.log('Adding schedule:', req.body);

    // Validate required fields
    if (!driverId || !pickupLocation || !dropoffLocation || !date || !timeFrom || !timeTo) {
      return res.status(400).json({ 
        error: 'All fields are required: driverId, pickupLocation, dropoffLocation, date, timeFrom, timeTo' 
      });
    }

    // Check driver status and availability
    const driver = await Driver.findOne({
      where: {
        id: driverId,
        status: 'active',
        isAvailable: true
      }
    });

    if (!driver) {
      return res.status(400).json({
        error: 'Driver must be active and available to create schedules'
      });
    }

    // Validate date is not in the past
    const scheduleDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (scheduleDate < today) {
      return res.status(400).json({ 
        error: 'Schedule date cannot be in the past' 
      });
    }

    // Check for overlapping schedules for the same driver
    const overlappingSchedule = await Schedule.findOne({
      where: {
        driverId,
        date,
        status: 'active',
        [Op.or]: [
          {
            timeFrom: {
              [Op.between]: [timeFrom, timeTo]
            }
          },
          {
            timeTo: {
              [Op.between]: [timeFrom, timeTo]
            }
          },
          {
            [Op.and]: [
              {
                timeFrom: {
                  [Op.lte]: timeFrom
                }
              },
              {
                timeTo: {
                  [Op.gte]: timeTo
                }
              }
            ]
          }
        ]
      }
    });

    if (overlappingSchedule) {
      return res.status(409).json({
        error: 'You already have a schedule during this time period'
      });
    }

    // Create new schedule
    const newSchedule = await Schedule.create({
      driverId,
      pickupLocation,
      dropoffLocation,
      date,
      timeFrom,
      timeTo,
      status: status || 'active' // Default to active if not provided
    });

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule: newSchedule
    });

  } catch (error) {
    console.error('Error adding schedule:', error);
    res.status(500).json({
      error: 'Internal server error while creating schedule',
      details: error.message
    });
  }
};

const getDriverSchedules = async (req, res) => {
  try {
    const { driverId } = req.params;

    const schedules = await Schedule.findAll({
      where: {
        driverId,
      },
      order: [
        ['status', 'ASC'],
        ['date', 'ASC'],
        ['timeFrom', 'ASC']
      ]
    });

    res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({
      error: 'Internal server error while fetching schedules',
      details: error.message
    });
  }
};

const cancelSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await Schedule.findByPk(scheduleId);

    if (!schedule) {
      return res.status(404).json({
        error: 'Schedule not found'
      });
    }

    if (schedule.status !== 'active') {
      return res.status(400).json({
        error: 'Only active schedules can be cancelled'
      });
    }

    await schedule.update({ status: 'cancelled' });

    res.status(200).json({
      message: 'Schedule cancelled successfully',
      schedule
    });
  } catch (error) {
    console.error('Error cancelling schedule:', error);
    res.status(500).json({
      error: 'Internal server error while cancelling schedule',
      details: error.message
    });
  }
};

const checkAvailableVehicles = async (req, res) => {
  try {
    const { 
      pickupLocation, 
      dropoffLocation, 
      date, 
      time,
      distance // in km
    } = req.body;

    const requestedTime = time;  // Convert to HH:MM format

    // Input validation
    if (!pickupLocation || !dropoffLocation || !date || !time || !distance) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    console.log('Checking available vehicles:', req.body);
    
    // Find schedules that match the criteria
    const matchingSchedules = await Schedule.findAll({
      where: {
        date: date,
        status: 'active',
        pickupLocation: pickupLocation,
        dropoffLocation: dropoffLocation,
        timeFrom: {
          [Op.lte]: requestedTime
        },
        timeTo: {
          [Op.gte]: requestedTime
        }
      },
      include: [{
        model: Driver,
        as: 'driver',
        where: {
          status: 'active',
          isAvailable: true
        },
        attributes: [
          'id',
          'firstName',
          'lastName',
          'vehicleType',
          'vehicleNumber',
          'rating'
        ]
      }],
      order: [
        ['driver', 'rating', 'DESC']
      ]
    });

    // If no matching schedules found, return a proper response
    if (!matchingSchedules || matchingSchedules.length === 0) {
      return res.status(200).json({  // Changed to 200 to avoid triggering error handling
        success: false,
        message: 'No vehicles available for the selected route and time',
        vehicles: {}  // Return empty object instead of undefined
      });
    }

    // Calculate prices and format response
    const baseRates = {
      'Sedan': 10,
      'SUV': 20,
      'Luxury': 30
    };

    // Group vehicles by type and include driver info
    const groupedVehicles = matchingSchedules.reduce((acc, schedule) => {
      const driver = schedule.driver;
      const baseRate = baseRates[driver.vehicleType] || 15;
      const price = Math.round(distance * baseRate);

      const vehicleInfo = {
        scheduleId: schedule.id,
        driverId: driver.id,
        driverName: `${driver.firstName} ${driver.lastName}`,
        rating: parseFloat(driver.rating),
        vehicleNumber: driver.vehicleNumber,
        price: `₹${price}`,
        pickupTime: schedule.timeFrom,
        dropoffTime: schedule.timeTo
      };

      if (!acc[driver.vehicleType]) {
        acc[driver.vehicleType] = [];
      }
      acc[driver.vehicleType].push(vehicleInfo);
      acc[driver.vehicleType].sort((a, b) => b.rating - a.rating);
      
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      vehicles: groupedVehicles
    });

  } catch (error) {
    console.error('Error checking available vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking vehicle availability',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add new endpoint to get PNR details by schedule ID
const getPnrBySchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const pnr = await PNR.findOne({
      where: { 
        scheduleId,
        status: 'active'
      },
      include: [
        {
          model: Passenger,
          as: 'passenger',
          attributes: ['firstName', 'lastName', 'phoneNumber']
        }
      ]
    });

    if (!pnr) {
      return res.status(404).json({
        success: false,
        message: 'No active booking found for this schedule'
      });
    }

    res.status(200).json({
      success: true,
      booking: {
        pnr: pnr.PNRid,
        passenger: {
          name: `${pnr.passenger.firstName} ${pnr.passenger.lastName}`,
          phoneNumber: pnr.passenger.phoneNumber
        }
      }
    });

  } catch (error) {
    console.error('Error fetching PNR details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details'
    });
  }
};

module.exports = {
  addSchedule,
  getDriverSchedules,
  cancelSchedule,
  checkAvailableVehicles,
  sendOtp,
  verifyOtp,
  getPnrBySchedule
};