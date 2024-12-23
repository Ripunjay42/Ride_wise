// models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.js')[env];
const db = {};

// Load pg module
let pg;
try {
  pg = require('pg');
} catch (error) {
  console.error('Error loading pg module:', error);
  throw error;
}

let sequelize;

try {
  // Initialize Sequelize with pg module
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], {
      ...config,
      dialectModule: pg
    });
  } else {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        ...config,
        dialectModule: pg
      }
    );
  }
} catch (error) {
  console.error('Sequelize initialization error:', error);
  throw error;
}

try {
  // Load models
  fs.readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      );
    })
    .forEach(file => {
      try {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      } catch (error) {
        console.error(`Error loading model ${file}:`, error);
        throw error;
      }
    });

  // Set up associations
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
} catch (error) {
  console.error('Error during model loading or association:', error);
  throw error;
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;