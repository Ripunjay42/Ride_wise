const express = require('express');
const router = express.Router();
const { addSchedule, getDriverSchedules, cancelSchedule} = require('../controllers/scheduleController');

router.post('/schedules', addSchedule);
router.get('/schedules/driver/:driverId', getDriverSchedules);
router.put('/schedules/:scheduleId/cancel', cancelSchedule);

module.exports = router;