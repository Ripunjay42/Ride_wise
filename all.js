const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Passenger = sequelize.define('Passenger', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true
  });
  return Passenger;
};




const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Driver = sequelize.define('Driver', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    licenseNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    vehicleNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    vehicleType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'inactive'
    },
    licenseValidity: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true
  });
  return Driver;
};

// models/schedule.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Drivers',
        key: 'id'
      }
    },
    pickupLocation: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dropoffLocation: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timeFrom: {
      type: DataTypes.TIME,
      allowNull: false
    },
    timeTo: {
      type: DataTypes.TIME,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'completed', 'cancelled']]
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['driverId', 'date'],
        name: 'schedule_driver_date_idx'
      }
    ]
  });

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Driver, {
      foreignKey: 'driverId',
      as: 'driver'
    });
  };

  return Schedule;
};

// models/admin.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Admin extends Model {}

  Admin.init({
    admin_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Use Sequelize's UUIDV4 for UUID generation
      primaryKey: true,
      allowNull: false,
    },
    admin_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Admin',
    tableName: 'Admin', // This makes sure the table name is exactly "Admin"
    timestamps: false, // Set to true if you want createdAt/updatedAt fields
  });

  return Admin;
};



