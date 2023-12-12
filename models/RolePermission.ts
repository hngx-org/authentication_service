import {Model, DataType, Column, Table, CreatedAt, BelongsToMany, ForeignKey} from "sequelize-typescript";
import Permission from "./Permission";
import Role from "./Role";

@Table({tableName: "roles_permissions", timestamps: false})
export default class RolePermission extends Model<RolePermission> {
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true, autoIncrementIdentity: true })
      id: number;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER, field: 'role_id'})
      roleId: number;

    @ForeignKey(() => Permission)
    @Column({type: DataType.INTEGER, field: 'permission_id'})
      permissionId: number;

    @CreatedAt
    @Column({type: DataType.DATE, field: 'created_at'})
      createdAt: Date;

    @BelongsToMany(() => Permission, () => RolePermission,  'role_id',  'permission_id')
      permissions: RolePermission[];

    @BelongsToMany(() => Role , () => RolePermission,  'permission_id',  'role_id')
      roles: RolePermission[];
}
