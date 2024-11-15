const { Schedule, Driver } = require('../models'); // Import both Schedule and Driver models
const { Op } = require('sequelize'); // Import Sequelize operators

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
        ['date', 'DESC'],
        ['timeFrom', 'DESC']
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

module.exports = {
  addSchedule,
  getDriverSchedules,
  cancelSchedule,
  checkAvailableVehicles
};