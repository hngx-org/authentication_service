const { DataTypes, HasMany } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./Users');

const Role = sequelize.define(
  'roles',
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
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

module.exports = Role;
