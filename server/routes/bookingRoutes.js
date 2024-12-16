const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/create', bookingController.createBooking);

// Get booking details by PNR
router.get('/pnr/:pnr', bookingController.getBookingDetails);

// Fix: Changed from '/passenger/passengerId' to '/passenger/:passengerId'
router.get('/passenger/:passengerId', bookingController.getPassengerBookings);

router.post('/rate', bookingController.rateDriver);

module.exports = router;