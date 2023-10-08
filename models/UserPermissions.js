const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User");
const Permission = require("./Permissions");

const UserPermissions = sequelize.define(
  "user_permissions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true,
      autoIncrement: true,
    },
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { freezeTableName: true, timestamps: false },
);

User.belongsToMany(Permission, {
  through: UserPermissions,
  foreignKey: "user_id",
});

Permission.belongsToMany(User, {
  through: UserPermissions,
  foreignKey: "permission_id",
});

module.exports = UserPermissions;
