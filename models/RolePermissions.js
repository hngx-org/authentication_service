const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Role = require("./Roles");
const Permission = require("./Permission");

const RolePermissions = sequelize.define(
  "role_permissions",
  {
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: "id",
      },
    },
    permission_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Permission,
        key: "id",
      },
    },
  },
  { freezeTableName: true },
);

Role.belongsToMany(Permission, { through: RolePermissions });
Permission.belongsToMany(Role, { through: RolePermissions });

module.exports = RolePermissions;
