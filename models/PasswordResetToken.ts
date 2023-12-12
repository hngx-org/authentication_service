import {Column, DataType, Model, Table, ForeignKey} from "sequelize-typescript";
import User from "./User";

@Table({tableName: "password_reset_tokens", timestamps: false})
export default class PasswordResetToken extends Model<PasswordResetToken> {

  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id: number;

  @Column({type: DataType.STRING, allowNull: false})
    token: string;

  // @Column({type: DataType.UUID, allowNull: false, references: {model: "user", key: "id"}})
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "userId",
  })
    userId: string;

  @Column({type: DataType.DATE, allowNull: false})
    expiresAt: Date;
}
