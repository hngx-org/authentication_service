const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User");
const Permission = require("./Permissions");

const UserPermissions = sequelize.define(
  "user_permissions",
  {
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: User,
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
  { freezeTableName: true, timestamps: false },
);

User.belongsToMany(Permission, { through: UserPermissions });
Permission.belongsToMany(User, { through: UserPermissions });

module.exports = UserPermissions;
