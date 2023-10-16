"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
const RolePermission_1 = __importDefault(require("../models/RolePermission"));
const Permission_1 = __importDefault(require("../models/Permission"));
const PasswordResetToken_1 = __importDefault(require("../models/PasswordResetToken"));
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
});
sequelize.addModels([Role_1.default]);
sequelize.addModels([User_1.default]);
sequelize.addModels([Permission_1.default]);
sequelize.addModels([PasswordResetToken_1.default]);
sequelize.addModels([RolePermission_1.default]);
exports.default = sequelize;
//# sourceMappingURL=db.config.js.map