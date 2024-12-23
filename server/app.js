const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(bodyParser.json());

// Updated CORS configuration
const allowedOrigins = ['http://localhost:3000', 'https://ride-wise-bay.vercel.app'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
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
