import {Model, DataType, Column, Table, CreatedAt, BelongsToMany} from "sequelize-typescript";
import Permissions from "./Permissions";
import Roles from "./Roles.js";

@Table({tableName: "role_permissions", timestamps: false})
export class RolePermissions extends Model<RolePermissions> {
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Column({type: DataType.INTEGER, references: {model: 'roles', key: 'id'}})
    role_id: number;

    @Column({type: DataType.INTEGER, references: {model: 'permissions', key: 'id'}  })
    permission_id: number;

    @CreatedAt
    created_at: Date;

    @BelongsToMany(() => Permissions, () => RolePermissions,  'role_id',  'permission_id')
    permissions: RolePermissions[];

    @BelongsToMany(() => Roles , () => RolePermissions,  'permission_id',  'role_id')
    roles: RolePermissions[];
}