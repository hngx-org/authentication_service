import {Model, Table, DataType, Column} from "sequelize-typescript";

@Table({tableName: "password_reset_tokens", timestamps: false})
export class PasswordResetToken extends Model<PasswordResetToken> {

    // use camelCase for column name mapping

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    token: string;

    @Column({type: DataType.UUID, allowNull: false, references: {model: "users", key: "id"}})
    userId: string;

    @Column({type: DataType.DATE, allowNull: false})
    expiresAt: Date;
}