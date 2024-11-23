const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Schedule = sequelize.define(
    'Schedule',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      driverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Drivers', // Make sure this matches the table name
          key: 'id',
        },
      },
      pickupLocation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dropoffLocation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      timeFrom: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      timeTo: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: 'active',
        validate: {
          isIn: [['active', 'busy', 'completed', 'cancelled']],
        },
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: 'Schedules', // Explicitly specify table name
      indexes: [
        {
          fields: ['driverId', 'date'],
          name: 'schedule_driver_date_idx',
        },
      ],
    }
  );

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Driver, {
      foreignKey: 'driverId',
      as: 'driver',
      onDelete: 'CASCADE',
    });
  };

  return Schedule;
};
