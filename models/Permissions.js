const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Permission = sequelize.define(
  'permissions',
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
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = Permission;
