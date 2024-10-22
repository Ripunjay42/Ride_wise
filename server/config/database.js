require('dotenv').config();  // Load environment variables from .env file

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    pool: {
      max: 10,          // Maximum number of connection in pool
      min: 0,           // Minimum number of connection in pool
      acquire: 30000,   // The maximum time (ms) Sequelize will try to get a connection before throwing error
      idle: 10000       // The maximum time (ms) that a connection can be idle before being released
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    pool: {
      max: 15,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
  },
};
