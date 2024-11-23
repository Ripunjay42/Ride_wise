// migrations/YYYYMMDDHHMMSS-add-schedule-id-to-pnr.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PNR', 'scheduleId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Schedules',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });

    // Add index for scheduleId
    await queryInterface.addIndex('PNR', {
      fields: ['scheduleId'],
      name: 'pnr_schedule_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('PNR', 'pnr_schedule_idx');
    await queryInterface.removeColumn('PNR', 'scheduleId');
  }
};