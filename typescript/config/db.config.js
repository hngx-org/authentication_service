"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Users_1 = __importDefault(require("../models/Users"));
const Roles_js_1 = __importDefault(require("../models/Roles.js"));
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
});
sequelize.addModels([Roles_js_1.default]);
sequelize.addModels([Users_1.default]);
exports.default = sequelize;
