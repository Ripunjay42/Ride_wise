// controllers/bookingController.js
const { PNR, Schedule, Driver, Passenger } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { sendEmail, generatePassengerEmail, generateDriverEmail } = require('../utils/emailService');
const { sequelize } = require('../models');

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

    // Validate required fields
    if (!scheduleId || !passengerId || !driverId || !locationFrom || !locationTo || !date || !time || !distance || !price) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create PNR record
    const pnr = await PNR.create({
      PNRid: uuidv4(),
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

    // Commit transaction
    await transaction.commit();

    // Send confirmation emails
    try {
      await Promise.all([
        sendEmail(passenger.email, generatePassengerEmail(pnr, driver)),
        sendEmail(driver.email, generateDriverEmail(pnr, passenger))
      ]);
    } catch (emailError) {
      console.error('Error sending confirmation emails:', emailError);
      // Don't fail the booking if emails fail
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      pnr: pnr.PNRid
    });

  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    
    console.error('Error creating booking:', error);
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
  
module.exports = {
  createBooking,
  getBookingDetails,
  getPassengerBookings
};