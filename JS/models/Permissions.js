const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Permission = sequelize.define(
  'permission',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { freezeTableName: true, timestamps: false },
);

module.exports = Permission;
