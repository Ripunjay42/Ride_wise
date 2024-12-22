require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: console.log,
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
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    pool: {
      max: 15,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

// Validation
Object.keys(config).forEach(env => {
  const conf = config[env];
  if (!conf.username || !conf.password || !conf.database || !conf.host) {
    console.error(`Missing required database configuration for ${env} environment`);
    console.error('Available environment variables:', {
      DB_USER: !!process.env.DB_USER,
      DB_PASSWORD: !!process.env.DB_PASSWORD,
      DB_NAME: !!process.env.DB_NAME,
      DB_HOST: !!process.env.DB_HOST,
      DB_PORT: !!process.env.DB_PORT
    });
  }
});

module.exports = config;