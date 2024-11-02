module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Schedules', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      driverId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Drivers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pickupLocation: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      dropoffLocation: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      timeFrom: {
        type: Sequelize.TIME,
        allowNull: false
      },
      timeTo: {
        type: Sequelize.TIME,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'active'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('Schedules', ['driverId', 'date'], {
      name: 'schedule_driver_date_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Schedules');
  }
};