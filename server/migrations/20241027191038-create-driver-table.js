'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the ENUM type for status only if it doesn't exist
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_drivers_status') THEN
          CREATE TYPE "enum_drivers_status" AS ENUM ('active', 'inactive');
        END IF;
      END$$;
    `);

    await queryInterface.createTable('Drivers', {
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
      licenseNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      vehicleNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      vehicleType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: "enum_drivers_status",
        defaultValue: 'inactive'
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
    await queryInterface.dropTable('Drivers');
    // Only attempt to drop the ENUM if it exists
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_drivers_status') THEN
          DROP TYPE "enum_drivers_status";
        END IF;
      END$$;
    `);
  }
};