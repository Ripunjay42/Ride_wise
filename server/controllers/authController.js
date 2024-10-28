const { Driver, Passenger } = require('../models'); // Import models

// Function to handle user signup
const signup = async (req, res) => {
  const { email, firstName, lastName, phoneNumber, userType, licenseNumber, vehicleNumber, vehicleType } = req.body;

  try {
    // Check user type and create accordingly
    if (userType === 'driver') {
      const newDriver = await Driver.create({
        email,
        firstName,
        lastName,
        phoneNumber,
        licenseNumber,
        vehicleNumber,
        vehicleType,
        isAvailable: true,
        status: 'active'
      });
      return res.status(201).json({ message: 'Driver registered successfully', driver: newDriver });
    } else if (userType === 'passenger') {
      const newPassenger = await Passenger.create({
        email,
        firstName,
        lastName,
        phoneNumber,
        status: 'active'
      });
      return res.status(201).json({ message: 'Passenger registered successfully', passenger: newPassenger });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'An error occurred during registration' });
  }
};



const checkUserExistence = async (req, res) => {
  const { email } = req.params; // Get the email from request parameters
  console.log('Checking existence for email:', email); // Log the email

  try {
    // Check in Driver collection
    const driverCount = await Driver.count({ where: { email } });
    console.log('Driver count:', driverCount); // Log count

    if (driverCount > 0) {
      return res.json({ exists: true });
    }

    // Check in Passenger collection
    const passengerCount = await Passenger.count({ where: { email } });
    console.log('Passenger count:', passengerCount); // Log count

    if (passengerCount > 0) {
      return res.json({ exists: true });
    }

    // If user not found in either collection
    return res.json({ exists: false });
  } catch (error) {
    console.error('Error checking user existence:', error);
    return res.status(500).json({ error: 'An error occurred while checking user existence' });
  }
};



module.exports = { signup, checkUserExistence };
