// models/pnr.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PNR = sequelize.define(
    'PNR',
    {
      PNRid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      passengerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Passengers',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      driverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Drivers',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      locationFrom: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      locationTo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      distance: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'complete', 'cancelled'),
        defaultValue: 'active',
      }
    },
    {
      tableName: 'PNR',
      timestamps: true
    }
  );

  PNR.associate = (models) => {
    PNR.belongsTo(models.Driver, {
      foreignKey: 'driverId',
      as: 'driver'
    });
    PNR.belongsTo(models.Passenger, {
      foreignKey: 'passengerId',
      as: 'passenger'
    });
  };

  return PNR;
};