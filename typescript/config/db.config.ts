import {Sequelize} from 'sequelize-typescript'
import Users from "../models/Users";
import Roles from "../models/Roles.js";

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
});

sequelize.addModels([Roles])
sequelize.addModels([Users]);
export default sequelize;