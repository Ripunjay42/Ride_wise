const express = require('express');
const { signup,  checkUserExistence, login } = require('../controllers/authController'); // Import the signup function

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', signup);
router.get('/user/:email', checkUserExistence);
router.post('/admin/login', login);


module.exports = router;


