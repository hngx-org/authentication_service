const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Role = require("./Roles");

const UserRoles = sequelize.define(
  "user_roles",
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
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
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

User.belongsToMany(Role, { through: UserRoles, foreignKey: "user_id" });
Role.belongsToMany(User, { through: UserRoles, foreignKey: "role_id" });

module.exports = UserRoles;
