const express = require('express');
const router = express.Router();
const { addSchedule, getDriverSchedules, cancelSchedule, checkAvailableVehicles} = require('../controllers/scheduleController');

router.post('/schedules', addSchedule);
router.get('/schedules/driver/:driverId', getDriverSchedules);
router.put('/schedules/:scheduleId/cancel', cancelSchedule);
router.post('/booking/check-availability', checkAvailableVehicles);

module.exports = router;