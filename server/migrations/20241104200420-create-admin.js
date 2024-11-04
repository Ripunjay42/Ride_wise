// migrations/XXXXXXXXXXXX-create-admin.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Admin', {
      admin_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'), // Use PostgreSQL's uuid_generate_v4()
        primaryKey: true,
        allowNull: false,
      },
      admin_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Admin');
  }
};
