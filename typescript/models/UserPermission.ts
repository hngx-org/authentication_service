/* eslint-disable camelcase */
import User from "../models/User";
import Permission from "../models/Permission";
import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from "sequelize-typescript";

@Table({ tableName: "user_permission", timestamps: false })
export default class UserPermission extends Model<UserPermission> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "user_id",
  })
    user_id: string;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "permission_id",
  })
    permission_id: number;
}
