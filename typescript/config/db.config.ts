import {Sequelize} from 'sequelize-typescript'
import Users from "../models/Users";
import Roles from "../models/Roles.js";
import RolesPermissions from "../models/RolePermissions.js";
import Permissions from "../models/Permissions.js";
import PasswordResetToken from "../models/PasswordResetToken";

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
});

sequelize.addModels([Roles])
sequelize.addModels([Users]);
sequelize.addModels([Permissions])
sequelize.addModels([PasswordResetToken])
sequelize.addModels([RolesPermissions])
export default sequelize;
