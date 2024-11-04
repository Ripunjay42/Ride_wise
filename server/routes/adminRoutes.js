const express = require('express');
const router = express.Router();
const { Driver, Passenger } = require('../models');
const { Op } = require('sequelize');

// Get all drivers
router.get('/api/drivers', async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'vehicleNumber',
        'vehicleType',
        'status',
        'gender',
        'licenseNumber',
        'rating',
        'isAvailable'
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Get all passengers
router.get('/api/passengers', async (req, res) => {
  try {
    const passengers = await Passenger.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'gender',
        'status',
        'createdAt'
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(passengers);
  } catch (error) {
    console.error('Error fetching passengers:', error);
    res.status(500).json({ error: 'Failed to fetch passengers' });
  }
});

// Verify driver (update status)
router.patch('/api/drivers/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const driver = await Driver.findByPk(id);
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    await driver.update({ status });
    
    res.json({ 
      message: 'Driver status updated successfully',
      driver: {
        id: driver.id,
        status: driver.status
      }
    });
  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({ error: 'Failed to update driver status' });
  }
});

// Get dashboard statistics
router.get('/api/admin/dashboard/stats', async (req, res) => {
  try {
    const totalDrivers = await Driver.count();
    const activeDrivers = await Driver.count({
      where: { status: 'active' }
    });
    const pendingDrivers = await Driver.count({
      where: { status: 'inactive' }
    });
    const totalPassengers = await Passenger.count();
    const activePassengers = await Passenger.count({
      where: { status: 'active' }
    });

    // Get new registrations in the last 7 days
    const lastWeek = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
    const newDrivers = await Driver.count({
      where: {
        createdAt: {
          [Op.gte]: lastWeek
        }
      }
    });
    const newPassengers = await Passenger.count({
      where: {
        createdAt: {
          [Op.gte]: lastWeek
        }
      }
    });

    res.json({
      drivers: {
        total: totalDrivers,
        active: activeDrivers,
        pending: pendingDrivers,
        newLastWeek: newDrivers
      },
      passengers: {
        total: totalPassengers,
        active: activePassengers,
        newLastWeek: newPassengers
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Search drivers
router.get('/api/drivers/search', async (req, res) => {
  const { query } = req.query;
  
  try {
    const drivers = await Driver.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
          { vehicleNumber: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
    
    res.json(drivers);
  } catch (error) {
    console.error('Error searching drivers:', error);
    res.status(500).json({ error: 'Failed to search drivers' });
  }
});

// Search passengers
router.get('/api/passengers/search', async (req, res) => {
  const { query } = req.query;
  
  try {
    const passengers = await Passenger.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
    
    res.json(passengers);
  } catch (error) {
    console.error('Error searching passengers:', error);
    res.status(500).json({ error: 'Failed to search passengers' });
  }
});

// Get driver details by ID
router.get('/api/drivers/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const driver = await Driver.findByPk(id);
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    res.json(driver);
  } catch (error) {
    console.error('Error fetching driver details:', error);
    res.status(500).json({ error: 'Failed to fetch driver details' });
  }
});

// Get passenger details by ID
router.get('/api/passengers/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const passenger = await Passenger.findByPk(id);
    
    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }
    
    res.json(passenger);
  } catch (error) {
    console.error('Error fetching passenger details:', error);
    res.status(500).json({ error: 'Failed to fetch passenger details' });
  }
});

module.exports = router;