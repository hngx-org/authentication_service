"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Permissions_1 = __importDefault(require("./Permissions"));
const Roles_js_1 = __importDefault(require("./Roles.js"));
let RolePermissions = class RolePermissions extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, primaryKey: true, autoIncrement: true, autoIncrementIdentity: true })
], RolePermissions.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, references: { model: 'roles', key: 'id' } })
], RolePermissions.prototype, "role_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, references: { model: 'permissions', key: 'id' } })
], RolePermissions.prototype, "permission_id", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt
], RolePermissions.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Permissions_1.default, () => RolePermissions, 'role_id', 'permission_id')
], RolePermissions.prototype, "permissions", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Roles_js_1.default, () => RolePermissions, 'permission_id', 'role_id')
], RolePermissions.prototype, "roles", void 0);
RolePermissions = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "role_permissions", timestamps: false })
], RolePermissions);
exports.default = RolePermissions;
