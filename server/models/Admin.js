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
