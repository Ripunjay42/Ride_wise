const express = require('express');
const router = express.Router();
const { addSchedule } = require('../controllers/scheduleController');

router.post('/schedules', addSchedule);

module.exports = router;