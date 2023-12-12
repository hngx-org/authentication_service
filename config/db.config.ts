import { Sequelize } from 'sequelize-typescript';
import User from '../models/User';
import Role from '../models/Role';
import RolePermission from '../models/RolePermission';
import Permission from '../models/Permission';
import UserPermission from '../models/UserPermission';
import PasswordResetToken from '../models/PasswordResetToken';
import dotenv from 'dotenv'; // ES6 import for dotenv
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  logging: false,
});

sequelize.addModels([Role, User, Permission, PasswordResetToken, RolePermission, UserPermission]);

sequelize
  .sync()
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

export default sequelize;
