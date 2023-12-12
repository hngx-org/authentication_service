import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({tableName: 'roles', timestamps: false})
export default class Role extends Model {
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
      id: number;

    @Column({type: DataType.STRING, allowNull: false})
      name: string;
}
