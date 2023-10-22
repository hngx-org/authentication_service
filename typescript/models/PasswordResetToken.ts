import {Column, DataType, Model, Table} from "sequelize-typescript";

@Table({tableName: "password_reset_tokens", timestamps: false})
export default class PasswordResetToken extends Model<PasswordResetToken> {

  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id: number;

  @Column({type: DataType.STRING, allowNull: false})
    token: string;

  @Column({type: DataType.UUID, allowNull: false, references: {model: "users", key: "id"}})
    userId: string;

  @Column({type: DataType.DATE, allowNull: false})
    expiresAt: Date;
}
