const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/create', bookingController.createBooking);

// Get booking details by PNR
router.get('/:pnr', bookingController.getBookingDetails);

module.exports = router;