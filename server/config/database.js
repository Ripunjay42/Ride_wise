// config/database.js
require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectModule: require('pg'),
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      keepAlive: true
    },
    retry: {
      max: 3
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectModule: require('pg'),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

// Validation without logging sensitive data
Object.keys(config).forEach(env => {
  const conf = config[env];
  const missingVars = [];
  
  if (!conf.username) missingVars.push('DB_USER');
  if (!conf.password) missingVars.push('DB_PASSWORD');
  if (!conf.database) missingVars.push('DB_NAME');
  if (!conf.host) missingVars.push('DB_HOST');
  if (!conf.port) missingVars.push('DB_PORT');
  
  if (missingVars.length > 0) {
    console.error(`Missing required database configuration for ${env} environment: ${missingVars.join(', ')}`);
  }
});

module.exports = config;

// Example .env file structure (DO NOT INCLUDE ACTUAL VALUES IN CODE)
/*
DB_HOST=your-host
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=your-database
DB_PORT=6543

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=your-email
LOG_LEVEL=info
NODE_ENV=production
*/