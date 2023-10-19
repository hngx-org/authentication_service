import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({tableName: 'role', timestamps: false})
export default class Role extends Model<Role> {
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
      id: number;

    @Column({type: DataType.STRING, allowNull: false})
      name: string;
}
