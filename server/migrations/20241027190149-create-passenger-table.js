// migrations/XXXXXX-create-passenger-table.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First create the ENUM type
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_passengers_status" AS ENUM ('active', 'inactive');`
    );

    await queryInterface.createTable('Passengers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: "enum_passengers_status",
        defaultValue: 'active'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Passengers');
    // Drop the ENUM type
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_passengers_status";`
    );
  }
};
