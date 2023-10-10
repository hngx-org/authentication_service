const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = require('./Roles');
const Permission = require('./Permissions');

const RolePermissions = sequelize.define(
  'roles_permissions',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'id',
      },
    },
    permission_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Permission,
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { freezeTableName: true, timestamps: false }
);

Role.belongsToMany(Permission, {
  through: RolePermissions,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
});
Permission.belongsToMany(Role, {
  through: RolePermissions,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
});

module.exports = RolePermissions;
