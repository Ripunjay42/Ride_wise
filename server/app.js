const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Add this with your other route configurations


const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Adjust based on your frontend URL
  origin: 'https://ride-wise-server.vercel.app/',
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', scheduleRoutes);
app.use(adminRoutes);
app.use('/api/booking', bookingRoutes);


// Sync database and start the server
sequelize.authenticate().then(() => {
  console.log('Connected to the database!');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = app;
