const express = require('express');
const router = express.Router();
const { addSchedule, getDriverSchedules, cancelSchedule, checkAvailableVehicles, sendOtp, verifyOtp, getPnrBySchedule} = require('../controllers/scheduleController');

router.post('/schedules', addSchedule);
router.get('/schedules/driver/:driverId', getDriverSchedules);
router.put('/schedules/:scheduleId/cancel', cancelSchedule);
router.post('/booking/check-availability', checkAvailableVehicles);
router.post('/schedules/:scheduleId/send-otp', sendOtp);
router.post('/schedules/:scheduleId/verify-otp', verifyOtp);
router.get('/pnr/schedule/:scheduleId', getPnrBySchedule);

module.exports = router;