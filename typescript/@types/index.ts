export interface IUser {
  id?: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  sectionOrder?: string;
  password: string;
  provider?: string;
  profilePic?: string;
  refreshToken?: string;
  roleId?: number;
  isVerified?: boolean;
  twoFactorAuth?: boolean;
  location?: string;
  country?: string;
  createdAt?: Date;
  userRole?: IRole;
}

export interface IPasswordResetToken {
  id: number;
  token: string;
  userId: string;
  expiresAt: Date;
}

export interface IRole {
  id: number;
  name: string;
}

export interface IPermission {
  id: number;
  name: string;
  createdAt: Date;
}

export interface IRolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt: Date;
}

export interface ITokenPayload {
  id: string;
  email: string;
  firstName: string;
  exp?: number;
}

export interface ITwoFactorPayload {
  id: string;
  code: string;
  token: string;
  exp: number;
}

export interface IUserSignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
