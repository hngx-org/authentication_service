import { IUser } from './../../@types/index';
import userService from '../../services/UserService';
import {
  changePasswordSchema,
  emailValidationSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  tokenValidationSchema,
  twofaValidationSchema,
  updateUserSchema,
} from './validation';
import { NextFunction, Request, Response } from 'express';
import { generateToken, success } from '../../utils';
import { InvalidInput } from '../../middlewares/error';
// import { AuthErrorHandler } from '../../exceptions/AuthErrorHandler';

/**
 * @param req
 * @param res
 * @returns
 */

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    const findUser = await userService.signUp(req.body);
    return success('Account created successfully', findUser, 201, res);
  } catch (error) {
    next(error); // Pass the specific error to the error handling middleware
  }
};

/**
 * @param req
 * @param res
 */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = loginSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }

    const user: IUser = await userService.login(req.body);

    const token = await generateToken(user);
    return success('Login successfully', { token, user }, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @param req
 * @param res
 * @returns
 */
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = tokenValidationSchema.validate(req.params);
    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    const { token } = req.params;
    const user = await userService.verifyUser(token);
    return success('Account activated successfully', user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = emailValidationSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    const { email } = req.body;
    const response = await userService.resendVerification(email);
    return success(
      'Email verification code resent successfully',
      response,
      200,
      res
    );
  } catch (error) {
    next(error);
  }
};
/**
 * @param req
 * @param res
 * @returns
 */
export const checkEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = emailValidationSchema.validate(req.body);

    if (error) {
      throw new InvalidInput(error.details[0].message as string);
    }
    const { email } = req.body;
    const emailAvailable = await userService.checkEmail(email);
    if (!emailAvailable) {
      return success('Email is available for use', emailAvailable, 200, res);
    }
  } catch (error) {
    next(error);
  }
};
/**
 * @param req
 * @param res
 * @returns
 */
export const changeVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = emailValidationSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }

    const { email } = req.body;
    return await userService.changeVerificationEmail(email);
  } catch (error) {
    next(error);
  }
};
/**
 * @param req
 * @param res
 * @returns
 */
export const changeEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = tokenValidationSchema.validate(req.params);
    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    const { token } = req.params;

    return await userService.changeEmail(token);
  } catch (error) {
    next(error);
  }
};

/**
 * @param req
 * @param res
 * @returns
 */
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }

    const user = req.user as IUser;
    const findUser = await userService.changePassword(req.body, user.id);
    return success('Password changed successfully', findUser, 201, res);
  } catch (error) {
    next(error);
  }
};
/**
 * @param req
 * @param res
 * @returns
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const { error } = emailValidationSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }

    const findUser = await userService.forgotPassword(email);
    return success(
      'Forgot password link send successfully',
      findUser,
      200,
      res
    );
  } catch (error) {
    next(error);
  }
};
/**
 * @param req
 * @param res
 * @returns
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const { error } = resetPasswordSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    const findUser = await userService.resetPassword(token, newPassword);
    return success('Password change successfully', findUser, 200, res);
  } catch (error) {
    next(error);
  }
};
/**
 * @param req
 * @param res
 * @returns
 */
export const revalidateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const user = await userService.revalidateLogin(token);
    return success('Login successful', user, 200, res);
  } catch (error) {
    next(error);
  }
};
/**
 * @param req
 * @param res
 * @returns
 */
export const enable2fa = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.user as IUser;

    const findUser = await userService.enable2fa(email);
    return success('Two factor authentication enabled', findUser, 201, res);
  } catch (error) {
    next(error);
  }
};
/**
 *
 * @param req
 * @param res
 * @returns
 */
export const send2faCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.user as IUser;
    const findUser = await userService.send2faCode(email);
    return success('Two factor code sent', findUser, 201, res);
  } catch (error) {
    next(error);
  }
};

export const verify2faCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = twofaValidationSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }

    const { code, token } = req.body;

    return await userService.verify2faCode(code, token);
  } catch (error) {
    next(error);
  }
};

export const fetchAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.fetchAllUser();
    return success('Fetched successfully', users, 200, res);
  } catch (error) {
    next(error);
  }
};

export const findUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const findUser = await userService.findUserById(userId);
    return success('Fetched successfully', findUser, 200, res);
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    return await userService.deleteUserById(userId);
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = updateUserSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    const { email } = req.user as IUser;
    return await userService.updateUserById(req.body, email);
  } catch (error) {
    next(error);
  }
};
