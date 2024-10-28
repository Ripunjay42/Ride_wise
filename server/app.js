const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

// Sync database and start the server
sequelize.authenticate().then(() => {
  console.log('Connected to the database!');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = app;
