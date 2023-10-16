import {Model, DataType, Column, Table, CreatedAt, BelongsToMany} from "sequelize-typescript";
import Permission from "./Permission";
import Role from "./Role";

@Table({tableName: "role_permissions", timestamps: false})
export default class RolePermission extends Model<RolePermission> {
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true, autoIncrementIdentity: true })
      id: number;

    @Column({type: DataType.INTEGER, references: {model: 'roles', key: 'id'}, field: 'role_id'})
      roleId: number;

    @Column({type: DataType.INTEGER, references: {model: 'permissions', key: 'id'} , field: 'permission_id'})
      permissionId: number;

    @CreatedAt
    @Column({type: DataType.DATE, field: 'created_at'})
      createdAt: Date;

    @BelongsToMany(() => Permission, () => RolePermission,  'role_id',  'permission_id')
      permissions: RolePermission[];

    @BelongsToMany(() => Role , () => RolePermission,  'permission_id',  'role_id')
      roles: RolePermission[];
}
