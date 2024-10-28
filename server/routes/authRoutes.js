const express = require('express');
const { signup,  checkUserExistence } = require('../controllers/authController'); // Import the signup function

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', signup);
router.get('/user/:email', checkUserExistence);

module.exports = router;


