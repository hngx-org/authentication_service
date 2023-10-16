import {Model, Table, Column, CreatedAt, DataType} from "sequelize-typescript";

@Table({tableName: 'permissions', timestamps: false})
export default class Permission extends Model<Permission> {
@Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  id: number;

    @Column({type: DataType.STRING, allowNull: false})
      name: string;

    @CreatedAt
      createdAt: Date;
}
