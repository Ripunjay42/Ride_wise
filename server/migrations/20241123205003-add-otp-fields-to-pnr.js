'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PNR', 'otp', {
      type: Sequelize.STRING(6),
      allowNull: true
    });

    await queryInterface.addColumn('PNR', 'otpExpiresAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PNR', 'otp');
    await queryInterface.removeColumn('PNR', 'otpExpiresAt');
  }
};