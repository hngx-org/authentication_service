import { IUserSignUp } from '../../interfaces/user/userSignupInterface';

export interface IUserService {
  signUp(payload: IUserSignUp, res: unknown): Promise<unknown>;

  verifyUser(token: string, res: unknown): Promise<unknown>;

  login(
    payload: { email: string; password: string },
    res: unknown
  ): Promise<unknown>;

  changeVerificationEmail(token: string, res: unknown): Promise<unknown>;

  checkEmail(token: string, res: unknown): Promise<unknown>;

  changeEmail(token: string, res: unknown): Promise<unknown>;

  changePassword(
    payload: { token: string; oldPassword: string; newPassword: string },
    userId: string,
    res: unknown
  ): Promise<unknown>;

  forgotPassword(email: string, res: unknown): Promise<unknown>;

  resetPassword(
    token: string,
    password: string,
    res: unknown
  ): Promise<unknown>;

  enable2fa(token: string, res: unknown): Promise<unknown>;

  send2faCode(email: string, res: unknown): Promise<unknown>;

  fetchAllUser(res: unknown): Promise<unknown>;

  findUserById(id: string, res: unknown): Promise<unknown>;

  deleteUserById(id: string, res: unknown): Promise<unknown>;

  updateUserById(
    payload: { firstName: string; lastName: string },
    email: string,
    res: unknown
  ): Promise<unknown>;

  resendVerification(email: string, res: unknown): Promise<unknown>;
}
