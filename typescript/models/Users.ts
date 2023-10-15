import {Table, Column, Model, DataType, CreatedAt, ForeignKey, HasOne} from 'sequelize-typescript'
import Roles from "./Roles.js";

@Table({tableName: 'users'})
export default class Users extends Model<Users> {
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true})
    id: string;

    @Column({type: DataType.STRING, allowNull: false})
    username: string;

    @Column({type: DataType.STRING, allowNull: false})
    first_name: string;

    @Column({type: DataType.STRING, allowNull: false})
    last_name: string;

    @Column({type: DataType.STRING, allowNull: false})
    email: string;

    @Column({type: DataType.TEXT})
    section_order: string;

    @Column({type: DataType.STRING})
    password: string;

    @Column({type: DataType.STRING})
    provider: string;

    @Column({type: DataType.TEXT})
    profile_pic: string;

    @Column({type: DataType.STRING})
    refresh_token: string;

    @ForeignKey(() => Roles)
    @Column({type: DataType.INTEGER, defaultValue: 2, allowNull: false})
    role_id: number;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    is_verified: boolean;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    two_factor_auth: boolean;

    @Column({type: DataType.STRING(255)})
    location: string;

    @Column({type: DataType.STRING(255)})
    country: string;

    @CreatedAt
    createdAt: Date;

    // @HasOne(() => Roles, 'id')
    // user_roles: Roles;
}
