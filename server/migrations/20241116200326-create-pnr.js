'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PNR', {
      PNRid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      passengerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Passengers', // Adjust based on actual table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      driverId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Drivers', // Adjust based on actual table name
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      locationFrom: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      locationTo: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      distance: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'active',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('PNR');
  },
};
