const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes.js');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Sync database and start the server
sequelize.authenticate().then(() => {
  console.log('Connected to the database!');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = app;
