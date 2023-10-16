import {Table, Column, Model, DataType, CreatedAt, ForeignKey, HasOne} from 'sequelize-typescript'
import Roles from "./Roles.js";

@Table({tableName: 'users', timestamps: false})
export default class Users extends Model<Users> {
  @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true})
    id: string;

  @Column({type: DataType.STRING, allowNull: false})
    username: string;

  @Column({type: DataType.STRING, allowNull: false, field: 'first_name'})
    firstName: string;

  @Column({type: DataType.STRING, allowNull: false, field: 'last_name'})
    lastName: string;

  @Column({type: DataType.STRING, allowNull: false})
    email: string;

  @Column({type: DataType.TEXT, field: 'section_order'})
    sectionOrder: string;

  @Column({type: DataType.STRING})
    password: string;

  @Column({type: DataType.STRING})
    provider: string;

  @Column({type: DataType.TEXT, field: 'profile_pic'})
    profilePic: string;

  @Column({type: DataType.STRING, field: 'refresh_token'})
    refreshToken: string;

  @ForeignKey(() => Roles)
  @Column({type: DataType.INTEGER, defaultValue: 2, allowNull: false, field: 'role_id'})
    roleId: number;

  @Column({type: DataType.BOOLEAN, defaultValue: false, field: 'is_verified'})
    isVerified: boolean;

  @Column({type: DataType.BOOLEAN, defaultValue: false, field: 'two_factor_auth'})
    twoFactorAuth: boolean;

  @Column({type: DataType.STRING(255)})
    location: string;

  @Column({type: DataType.STRING(255)})
    country: string;

  @CreatedAt
    createdAt: Date;

  @HasOne(() => Roles, 'role_id')
    userRole: Roles;
}
