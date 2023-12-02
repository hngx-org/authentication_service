// import { AuthErrorHandler } from "./../../exceptions/AuthErrorHandler";
import {
  resetPasswordNotification,
  sendSignUpNotification,
  twoFactorAuthNotification,
  welcomeEmailNotification,
} from '../../controllers/UserController/messaging';
import {
  comparePassword,
  generate2faToken,
  generateBearerToken,
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
import { response } from 'express';

class UserService implements IUserService {
  public async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
    }
  }

  /**
   *
   * @param payload
   * @returns
   */
  public async signUp(
    payload: IUserSignUp
  ): Promise<{ mailSent: string; newUser: User }> {
    const { firstName, lastName, email, password } = payload;

    try {
      const userExists = await this.findUserByEmail(email);

      if (userExists) {
        throw new Conflict('User already exists');
      }
      const hashedPassword = await hashPassword(password);
      const slug = await this.slugify(firstName, lastName);

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        slug,
        password: hashedPassword,
      });

      const token = generateToken(newUser);

      const mailSent = await sendSignUpNotification(newUser, token);
      const response = { mailSent, newUser };
      return response;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);

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
        throw new Unauthorized('Invalid credentials');
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new Unauthorized('Invalid credentials');
      }

      if (user.isVerified === false) {
        throw new Forbidden('Email not verified');
      }
      delete user.password;
      return user;
    } catch (error) {
      throw new HttpError(
        error.status || 500,
        error.message || 'Something went wrong'
      );
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
      const user = await User.findByPk(decodedUser.id);

      if (!user) {
        throw new Unauthorized('Invalid token');
      }

      if (user.isVerified) {
        throw new BadRequest('Email already verified');
      }

      user.isVerified = true;
      await user.save();
      welcomeEmailNotification(user);

      return user;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
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
      throw new HttpError(error.status || 500, error.message);
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
  ): Promise<{ mailSent: string; user: User }> {
    try {
      // const user = await this.findUserByEmail(email);
      const user = await User.findByPk(userId);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      if (user.isVerified) {
        throw new BadRequest('Email already verified');
      }

      user.email = email;
      user.save();
      const token = await generateToken(user);
      const mailSent = await sendSignUpNotification(user, token);

      const response = { mailSent, user };
      return response;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
    }
  }

  /**
   *
   * @param token
   * @param res
   * @returns
   */
  public async changeEmail(
    token: string,
    email: string
  ): Promise<{ mailSent: string; user: User }> {
    const decodedUser = verifyToken(token);

    if (!decodedUser) {
      throw new Unauthorized('Invalid token');
    }

    try {
      const user = await User.findByPk(decodedUser.id);

      if (user) {
        throw new Conflict('Email already in use');
      }

      user.email = email;
      await user.save();
      const mailSent = await sendSignUpNotification(user, token);

      const response = { mailSent, user };
      return response;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
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
      throw new HttpError(error.status || 500, error.message);
    }
  }
  /**
   *
   * @param email
   * @param res
   * @returns
   */
  public async forgotPassword(email: string): Promise<string> {
    try {
      const user = await this.findUserByEmail(email);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      if (user.isVerified === false) {
        throw new HttpError(403, 'Account not verified not found');
      }

      const token = await generateToken(user);

      const mailSent = resetPasswordNotification(user, token);

      return mailSent;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
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

      const user = await User.findByPk(decodedUser.id);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }
      user.password = await hashPassword(password);

      await user.save();
      return user;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
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
      throw new HttpError(error.status || 500, error.message);
    }
  }
  /**
   *
   * @param email
   * @param res
   * @returns
   */
  public async enable2fa(token: string): Promise<unknown> {
    try {
      const decodedUser = verifyToken(token);
      if (!decodedUser) {
        throw new Unauthorized('Token has Expired');
      }
      const user = await User.findByPk(decodedUser.id);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }
      user.twoFactorAuth = true;
      await user.save();
      return user;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
    }
  }

  public async disable2fa(token: string): Promise<unknown> {
    try {
      const decodedUser = verifyToken(token);
      if (!decodedUser) {
        throw new Unauthorized('Token has Expired');
      }
      const user = await User.findByPk(decodedUser.id);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }
      user.twoFactorAuth = false;
      await user.save();
      return user;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
    }
  }

  /**
   *
   * @param email
   * @param res
   * @returns
   */
  public async send2faCode(
    email: string
  ): Promise<{ user: User; token: string; mailSent: string }> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      if (user.twoFactorAuth === false) {
        throw new Forbidden('2fa is not enabled');
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const token = generate2faToken(user, code);

      const mailSent = await twoFactorAuthNotification(user, code);

      const response = { user, token, mailSent };
      return response;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
    }
  }

  public async verify2faCode(token: string, code: string): Promise<unknown> {
    try {
      const decoded = verify2faToken(token);
      if (!decoded) {
        throw new Unauthorized('Invalid Token');
      }
      if (decoded.code && decoded.code === code) {
        const user = await User.findByPk(decoded.id);
        if (!user) {
          throw new ResourceNotFound('User not found');
        }
        return user;
      }
      throw new BadRequest('Invalid code');
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
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
      throw new HttpError(error.status || 500, error.message);
    }
  }
  /**
   *
   * @param id
   * @param res
   * @returns
   */
  public async findUserById(userId: string): Promise<IUser | Error> {
    try {
      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        throw new ResourceNotFound('User not found');
      }
      return user;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
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
      throw new HttpError(error.status || 500, error.message);
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
      throw new HttpError(error.status || 500, error.message);
    }
  }

  public async updateRole(
    payload: { roleId: number;},
    userId: string
  ): Promise<unknown> {
    const { roleId } = payload;
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new ResourceNotFound('User not found');
      }
      user.roleId = roleId;
      await user.save();
      const response = { id: user.id, roleId: user.roleId } 
      return response
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
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

      const response = await sendSignUpNotification(user, token);
      return response;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message);
    }
  }

  public async setIsSeller(token: string): Promise<unknown> {
    try {
      const decoded = verifyToken(token);

      if (!decoded) {
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
      throw new HttpError(error.status || 500, error.message);
    }
  }

  public async loginResponse(user: IUser): Promise<unknown> {
    const authUser = await User.findByPk(user.id);
    const token = generateBearerToken(authUser);
    authUser.lastLogin = new Date();
    await authUser.save();
    return token;
  }

  public async slugify(firstName: string, lastName: string): Promise<string> {
    let str = firstName + '-' + lastName;
    str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space

    str = str.toLowerCase(); // convert string to lowercase

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
      .replace(/-+/g, '-'); // remove consecutive hyphens

    // check if slug already exists
    // Check if slug already exists
    const count = await User.count({
      where: { firstName: firstName, lastName: lastName },
    });

    // If slug exists, append count to slug
    if (count) {
      str += '-' + count;
    }

    return str;
  }
}

const userService = new UserService();

export default userService;
