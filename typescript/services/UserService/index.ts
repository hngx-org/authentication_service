// import { AuthErrorHandler } from "./../../exceptions/AuthErrorHandler";
import {
  resetPasswordNotification,
  sendSignUpNotification,
  twoFactorAuthNotification,
  welcomeEmailNotification,
} from '../../controllers/UserController/messaging';
import {
  comparePassword,
  generateBearerToken,
  generateFourDigitPassword,
  generateToken,
  hashPassword,
  success,
  verify2faToken,
  verifyToken,
} from '../../utils/index';
import User from '../../models/User';
import { IUserService } from './IUserService';
import { IUser } from '../../@types';
import {
  BadRequest,
  Conflict,
  Forbidden,
  HttpError,
  ResourceNotFound,
  Unauthorized,
} from '../../middlewares/error';
import { IUserSignUp } from '../../@types/index';

export class UserService implements IUserService {
  public async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }

  /**
   *
   * @param payload
   * @returns
   */
  public async signUp(payload: IUserSignUp): Promise<User> {
    const { firstName, lastName, email, password } = payload;

    try {
      const userExists = await this.findUserByEmail(email);

      if (userExists) {
        throw new Conflict('User already exists');
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const token = generateToken(newUser);
      const verificationLink = `${process.env.AUTH_FRONTEND_URL}/auth/verification-complete?token=${token}`;

      sendSignUpNotification(
        newUser.email,
        newUser.firstName,
        verificationLink
      );
      delete newUser.password;
      return newUser;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);

      // throw new AuthErrorHandler(AuthErrorHandler.InternalServerError);
      // errorResponse("Internal Server Error", 500, res);
    }
  }
  /**
   *
   * @param payload
   * @returns
   */
  public async login(
    payload: {
      email: string;
      password: string;
    }
    //
  ): Promise<IUser> {
    const { email, password } = payload;
    try {
      const user = await this.findUserByEmail(email);

      if (!user) {
        throw new Unauthorized('Invalid email or password');
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new Unauthorized('Invalid email or password');
      }

      if (user.isVerified === false) {
        throw new Unauthorized('Email not verified');
      }
      delete user.password;
      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }

  /**
   *
   * @param token
   * @returns
   */
  public async verifyUser(token: string): Promise<IUser | Error> {
    try {
      const decodedUser = verifyToken(token);

      if (!decodedUser) {
        throw new Unauthorized('Expired');
      }
      const user = await this.findUserByEmail(decodedUser.email);

      if (!user) {
        throw new Unauthorized('Invalid token');
      }

      if (user.isVerified) {
        throw new BadRequest('Email already verified');
      }

      user.isVerified = true;
      await user.save();
      const link = `${process.env.AUTH_FRONTEND_URL}`;
      welcomeEmailNotification(user.email, user.firstName, link);

      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }
  /**
   *
   * @param email
   * @returns
   */
  public async checkEmail(email: string): Promise<unknown> {
    try {
      const user = await this.findUserByEmail(email);

      if (user) {
        throw new Conflict('Email already in use');
      }
      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }
  /**
   *
   * @param email
   * @param res
   * @returns
   */
  public async changeVerificationEmail(
    userId: string,
    email: string
  ): Promise<unknown> {
    try {
      const user = await this.findUserByEmail(email);

      if (!user) {
        throw new ResourceNotFound('Email not found');
      }

      const token = await generateToken(user);
      const verificationLink = `${process.env.AUTH_FRONTEND_URL}/auth/verification-complete?token=${token}`;
      sendSignUpNotification(user.email, user.firstName, verificationLink);
      // sendVerificationEmail(user.firstName, user.email, token);
      return success(
        'Email change request link sent successfully',
        {
          id: user.id,
          email: user.email,
          token,
        },
        200
      );
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }

  /**
   *
   * @param token
   * @param res
   * @returns
   */
  public async changeEmail(token: string): Promise<unknown> {
    const decodedUser = verifyToken(token);

    if (!decodedUser) {
      throw new Unauthorized('Invalid token');
    }

    try {
      const user = await this.findUserByEmail(decodedUser.email);

      if (user) {
        throw new Conflict('Email already in use');
      }

      user.email = decodedUser.email;
      await user.save();
      return success(
        'Email changed successfully',
        {
          id: user.id,
          email: user.email,
        },
        200
      );
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }
  /**
   *
   * @param payload
   * @param userId
   * @param res
   * @returns
   */
  public async changePassword(payload: {
    token: string;
    oldPassword: string;
    newPassword: string;
  }): Promise<IUser | unknown> {
    try {
      const { token, oldPassword, newPassword } = payload;
      const decodedUser = verifyToken(token);

      if (!decodedUser) {
        throw new Unauthorized('Invalid token');
      }
      const user = await User.findByPk(decodedUser.id);
      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      const isMatch = await comparePassword(oldPassword, user.password);
      if (!isMatch) {
        throw new Unauthorized('Invalid password');
      }
      user.password = await hashPassword(newPassword);
      await user.save();
      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }
  /**
   *
   * @param email
   * @param res
   * @returns
   */
  public async forgotPassword(email: string): Promise<unknown> {
    try {
      const user = await this.findUserByEmail(email);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      if (user.isVerified === false) {
        throw new HttpError(403, 'Account not verified not found');
      }

      const token = await generateToken(user);
      const verificationLink = `${process.env.AUTH_FRONTEND_URL}/auth/reset-password?token=${token}`;

      resetPasswordNotification(user.email, user.firstName, verificationLink);

      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }
  /**
   *
   * @param token
   * @param password
   * @param res
   * @returns
   */
  public async resetPassword(
    token: string,
    password: string
  ): Promise<unknown> {
    try {
      const decodedUser = verifyToken(token);

      if (!decodedUser) {
        throw new Unauthorized('Invalid token');
      }

      const user = await this.findUserByEmail(decodedUser.email);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }
      user.password = await hashPassword(password);

      await user.save();
      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }
  /**
   *
   * @param token
   * @param res
   * @returns
   */
  public async revalidateLogin(token: string): Promise<unknown> {
    try {
      const decodedUser = verifyToken(token);
      if (!decodedUser) {
        throw new Unauthorized('Invalid token');
      }

      const user = await User.findByPk(decodedUser.id);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }
  /**
   *
   * @param email
   * @param res
   * @returns
   */
  public async enable2fa(email: string): Promise<unknown> {
    try {
      const user = await this.findUserByEmail(email);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }
      user.twoFactorAuth = true;
      await user.save();

      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }
  /**
   *
   * @param email
   * @param res
   * @returns
   */
  public async send2faCode(email: string): Promise<unknown> {
    const user = await this.findUserByEmail(email);
    try {
      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      if (user.twoFactorAuth === false) {
        throw new Forbidden('2fa is not enabled');
      }
      const code = await generateFourDigitPassword();
      user.twoFACode = code;

      await user.save();
      twoFactorAuthNotification(user.email, user.firstName, user.twoFACode);
      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }

  public async verify2faCode(token: string, code: string): Promise<unknown> {
    try {
      const decoded = verify2faToken(token);
      if (decoded.exp && Date.now() / 1000 > decoded.exp) {
        throw new Unauthorized('Token has expired');
      }
      if (decoded.code && decoded.code === code) {
        const user = await User.findByPk(decoded.id);
        if (!user) {
          throw new ResourceNotFound('User not found');
        }
        user.twoFACode = null;
        return user;
      }
      throw new BadRequest('Invalid code');
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }

  public async fetchAllUser(): Promise<unknown> {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'firstName',
          'username',
          'lastName',
          'email',
          'location',
          'country',
          'twoFactorAuth',
          'isVerified',
          'roleId',
          'provider',
        ],
      });
      return users;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }
  /**
   *
   * @param id
   * @param res
   * @returns
   */
  public async findUserById(userId: string): Promise<IUser | unknown> {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }
      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }
  public async deleteUserById(userId: string): Promise<IUser | unknown> {
    try {
      const user = await User.destroy({ where: { id: userId } });

      if (!user) {
        throw new ResourceNotFound('User not found');
      }
      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }

  public async updateUserById(
    payload: { firstName: string; lastName: string },
    email: string
  ): Promise<unknown> {
    const { firstName, lastName } = payload;
    try {
      const user = await this.findUserByEmail(email);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      user.firstName = firstName;
      user.lastName = lastName;
      await user.save();
      return success(
        'Deleted successfully',
        { id: user.id, email: user.email },
        201
      );
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }

  public async resendVerification(email: string): Promise<unknown> {
    try {
      const user = await this.findUserByEmail(email);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      if (user.isVerified === true) {
        throw new BadRequest('User already verified');
      }

      const token = generateToken(user);
      const verificationLink = `${process.env.AUTH_FRONTEND_URL}/auth/verification-complete?token=${token}`;

      const response = await sendSignUpNotification(
        user.email,
        user.firstName,
        verificationLink
      );
      // sendVerificationEmail(user.firstName, user.email, token);
      return response;
    } catch (error) {
      if (error.statusCode === 404) {
        throw new ResourceNotFound(error.message);
      }
      throw new BadRequest(error.message);
    }
  }

  public async setIsSeller(token: string): Promise<unknown> {
    try {
      const decoded = verifyToken(token);

      if ((decoded.exp && Date.now() / 1000 > decoded.exp) || !decoded) {
        throw new Unauthorized('Invalid token');
      }
      const user = await User.findByPk(decoded.id);
      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      user.isSeller = true;
      await user.save();
      return user;
    } catch (error) {
      throw new HttpError(error.statusCode, error.message);
    }
  }

  public async loginResponse(user: IUser): Promise<unknown> {
    const authUser = await User.findByPk(user.id);
    const token = generateBearerToken(authUser);
    authUser.lastLogin = new Date();
    await authUser.save();
    return token;
  }
}

const userService = new UserService();
export default userService;