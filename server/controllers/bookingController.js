// controllers/bookingController.js
const { PNR, Schedule, Driver, Passenger } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { sendEmail, generatePassengerEmail, generateDriverEmail } = require('../utils/emailService');
const { sequelize } = require('../models');
const logger = require('../utils/logger'); // Assumed logger utility

const createBooking = async (req, res) => {
  // Start transaction
  const transaction = await sequelize.transaction();

  try {
    const {
      scheduleId,
      passengerId,
      driverId,
      locationFrom,
      locationTo,
      date,
      time,
      distance,
      price
    } = req.body;

    // Validate required fields with more comprehensive checks
    const requiredFields = [
      'scheduleId', 'passengerId', 'driverId', 
      'locationFrom', 'locationTo', 'date', 
      'time', 'distance', 'price'
    ];

    const missingFields = requiredFields.filter(field => 
      !req.body[field] || 
      (typeof req.body[field] === 'string' && req.body[field].trim() === '')
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing or empty required fields: ${missingFields.join(', ')}`
      });
    }

    // Create PNR record
    const pnr = await PNR.create({
      PNRid: uuidv4(),
      scheduleId,
      passengerId,
      driverId,
      locationFrom,
      locationTo,
      date,
      time,
      distance: parseFloat(distance),
      price: parseFloat(price),
      status: 'active'
    }, { transaction });

    // Update schedule status
    await Schedule.update(
      { status: 'busy' },
      { 
        where: { 
          id: scheduleId,
          status: 'active'
        },
        transaction
      }
    );

    // Fetch driver and passenger details
    const [driver, passenger] = await Promise.all([
      Driver.findByPk(driverId),
      Passenger.findByPk(passengerId)
    ]);

    // Validate driver and passenger
    if (!driver || !passenger) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Driver or Passenger not found'
      });
    }

    // Commit transaction before sending emails
    await transaction.commit();

    // Async email sending with better error handling
    try {
      const [passengerEmailSent, driverEmailSent] = await Promise.allSettled([
        sendEmail(passenger.email, generatePassengerEmail(pnr, driver)),
        sendEmail(driver.email, generateDriverEmail(pnr, passenger))
      ]);

      // Log email sending results
      logger.info('Email Sending Results', {
        passenger: passengerEmailSent.status,
        driver: driverEmailSent.status
      });

      // Optional: You could implement a notification system 
      // for failed email sends if needed
    } catch (emailError) {
      logger.error('Email Sending Error', {
        error: emailError,
        pnrId: pnr.PNRid
      });
      // Non-blocking email error
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      pnr: pnr.PNRid
    });

  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    
    logger.error('Booking Creation Error', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getBookingDetails = async (req, res) => {
    try {
      const { pnr } = req.params;
  
      const booking = await PNR.findOne({
        where: { PNRid: pnr },
        include: [
          {
            model: Driver,
            as: 'driver',
            attributes: ['firstName', 'lastName', 'vehicleNumber', 'vehicleType', 'phoneNumber']
          },
          {
            model: Passenger,
            as: 'passenger',
            attributes: ['firstName', 'lastName', 'phoneNumber']
          }
        ]
      });
  
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
  
      const formattedData = {
        success: true,
        booking: {
          pnr: booking.PNRid,
          locationFrom: booking.locationFrom,
          locationTo: booking.locationTo,
          date: booking.date,
          time: booking.time,
          distance: booking.distance,
          price: booking.price,
          status: booking.status,
          driver: booking.driver ? {
            name: `${booking.driver.firstName} ${booking.driver.lastName}`,
            vehicleNumber: booking.driver.vehicleNumber,
            vehicleType: booking.driver.vehicleType,
            phoneNumber: booking.driver.phoneNumber
          } : null,
          passenger: booking.passenger ? {
            name: `${booking.passenger.firstName} ${booking.passenger.lastName}`,
            phoneNumber: booking.passenger.phoneNumber
          } : null
        }
      };
  
      res.status(200).json(formattedData);
  
    } catch (error) {
      console.error('Error fetching booking details:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching booking details'
      });
    }
  };

  const getPassengerBookings = async (req, res) => {
    try {
      const { passengerId } = req.params;
      console.log(passengerId);
  
      const bookings = await PNR.findAll({
        where: { passengerId },
        include: [
          {
            model: Driver,
            as: 'driver',
            attributes: ['firstName', 'lastName', 'vehicleNumber', 'vehicleType', 'phoneNumber']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      const formattedBookings = bookings.map(booking => ({
        pnr: booking.PNRid,
        locationFrom: booking.locationFrom,
        locationTo: booking.locationTo,
        date: booking.date,
        time: booking.time,
        distance: booking.distance,
        price: booking.price,
        status: booking.status,
        driver: booking.driver ? {
          name: `${booking.driver.firstName} ${booking.driver.lastName}`,
          vehicleNumber: booking.driver.vehicleNumber,
          vehicleType: booking.driver.vehicleType,
          phoneNumber: booking.driver.phoneNumber
        } : null
      }));
  
      res.status(200).json({
        success: true,
        bookings: formattedBookings
      });
  
    } catch (error) {
      console.error('Error fetching passenger bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching bookings'
      });
    }
  };
  
  const rateDriver = async (req, res) => {
    const transaction = await sequelize.transaction();
  
    try {
      const { 
        vehicleNumber, 
        pnr, 
        driverBehavior, 
        drivingSkill, 
        vehicleCleanliness, 
        punctuality, 
        overallSatisfaction 
      } = req.body;
  
      // Validate inputs
      const requiredFields = [
        'vehicleNumber', 'pnr', 
        'driverBehavior', 'drivingSkill', 
        'vehicleCleanliness', 'punctuality', 
        'overallSatisfaction'
      ];
  
      const missingFields = requiredFields.filter(field => 
        !req.body[field] || 
        (typeof req.body[field] === 'number' && (req.body[field] < 1 || req.body[field] > 5))
      );
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid or missing fields: ${missingFields.join(', ')}`
        });
      }
  
      // Find the driver by vehicle number
      const driver = await Driver.findOne({ 
        where: { vehicleNumber } 
      });
  
      if (!driver) {
        return res.status(404).json({
          success: false,
          message: 'Driver not found'
        });
      }
  
      // Find the PNR to ensure it's a completed booking for this driver
      const booking = await PNR.findOne({ 
        where: { 
          PNRid: pnr, 
          driverId: driver.id, // Use driver ID from found driver
          status: 'completed' 
        } 
      });
  
      if (!booking) {
        return res.status(400).json({
          success: false,
          message: 'Invalid booking for rating'
        });
      }
  
      // Calculate average rating
      const averageRating = (
        driverBehavior + 
        drivingSkill + 
        vehicleCleanliness + 
        punctuality + 
        overallSatisfaction
      ) / 5;
  
      // Update driver's rating
      // New rating is weighted average of existing and new rating
      const currentRating = driver.rating || 0;
      const totalRatings = driver.totalRatings || 0;
  
      const newTotalRatings = totalRatings + 1;
      const newOverallRating = ((currentRating * totalRatings) + averageRating) / newTotalRatings;
  
      await Driver.update(
        { 
          rating: parseFloat(newOverallRating.toFixed(2)),
          totalRatings: newTotalRatings
        },
        { 
          where: { id: driver.id },
          transaction
        }
      );
  
      // Mark booking as rated
      await PNR.update(
        { isRated: true },
        { 
          where: { PNRid: pnr },
          transaction
        }
      );
  
      // Commit transaction
      await transaction.commit();
  
      // Log rating
      logger.info('Driver Rated', {
        vehicleNumber,
        pnr,
        averageRating,
        newOverallRating
      });
  
      res.status(200).json({
        success: true,
        message: 'Driver rated successfully',
        newRating: newOverallRating
      });
  
    } catch (error) {
      // Rollback transaction
      await transaction.rollback();
  
      logger.error('Driver Rating Error', {
        message: error.message,
        stack: error.stack
      });
  
      res.status(500).json({
        success: false,
        message: 'Error processing driver rating',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

module.exports = {
  createBooking,
  getBookingDetails,
  getPassengerBookings,
  rateDriver
};