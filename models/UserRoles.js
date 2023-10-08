const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Role = require("./Roles");

const UserRoles = sequelize.define(
  "user_roles",
  {
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
  },
  { freezeTableName: true },
);

User.belongsToMany(Role, { through: UserRoles });
Role.belongsToMany(User, { through: UserRoles });

module.exports = UserRoles;
