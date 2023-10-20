import { IUser } from "./../../@types/index";
import userService from "../../services/UserService";
import {
  changePasswordSchema,
  emailValidationSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  tokenValidationSchema,
  twofaValidationSchema,
  updateUserSchema,
} from "./validation";
import { NextFunction, Request, Response } from "express";
import { generateBearerToken, success } from "../../utils";
import { InvalidInput, ResourceNotFound } from "../../middlewares/error";
// import { AuthErrorHandler } from '../../exceptions/AuthErrorHandler';

/**
 * @param req
 * @param res
 * @returns
 */

export const signUp = async (
  req: Request,
  res: Response,
) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    const user = await userService.signUp(req.body);
    const { id, firstName, lastName, email } = user;
    res.status(200).json({
      status: 200,
      message:
        "User created successfully. Please check your email to verify your account",
      user: { id, firstName, lastName, email },
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({error:error});
  }
};

export const guestSignup = async (
  req: Request,
  res: Response,
) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    req.body.roleId = 1;
    const user = await userService.signUp(req.body);
    const { id, firstName, lastName, email } = user;
    res.status(200).json({
      status: 200,
      message:
        "User created successfully. Please check your email to verify your account",
      user: { id, firstName, lastName, email },
    });
  } catch (error) {
    return res.status(500).json({error:error.message});
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
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({error:error.message});
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
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
};

/**
 * @param req
 * @param res
 * @returns
 */
export const resendVerification = async (
  req: Request,
  res: Response,
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
      "Email verification code resent successfully",
      response,
      200,
      res
    );
  } catch (error) {
    return res.status(500).json({error:error.message});
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
      return success("Email is available for use", emailAvailable, 200, res);
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
/**
 * @param req
 * @param res
 * @returns
 */
export const changeEmail = async (
  req: Request,
  res: Response,
) => {
  try {
    const { error } = emailValidationSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    const token = req.headers.authorization as string;

    const user = await userService.changeEmail(token, req.body.email);
    const { id, firstName, lastName, email } = user;
    res.status(200).json({
      status: 200,
      message:
        "User created successfully. Please check your email to verify your account",
      user: { id, firstName, lastName, email },
    });
  } catch (error) {
    return res.status(500).json({error:error.message});
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
) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }

    await userService.changePassword(req.body);
    return success("Password reset successful", null, 200, res);
  } catch (error) {
    return res.status(500).json({error:error.message});
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
) => {
  try {
    const { error } = emailValidationSchema.validate(req.body);
    const { email } = req.body;
    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }

    const response = await userService.forgotPassword(email);
    if (response) {
      return success("Password reset link sent successfully", null, 200, res);
    }
  } catch (error) {
    return res.status(500).json({error:error.message});
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
) => {
  try {
    const { token, password } = req.body;

    const { error } = resetPasswordSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    const user = await userService.resetPassword(token, password);

    if (user) {
      return success("Password reset successful", null, 200, res);
    }
  } catch (error) {
    return res.status(500).json({error:error.message});
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
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({error:error.message});
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
) => {
  try {
    const { error } = tokenValidationSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new ResourceNotFound(errorMessages);
    }
    const { token } = req.body;
    const response = await userService.enable2fa(token);
    if (response) {
      return success("Two factor authentication enabled", null, 200, res);
    }
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
};

export const disable2fa = async (
  req: Request,
  res: Response,
) => {
  try {
    const { error } = tokenValidationSchema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new ResourceNotFound(errorMessages);
    }

    const { token } = req.body;

    const response = await userService.disable2fa(token);
    if (response) {
      return success("Two factor authentication disabled", null, 200, res);
    }
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
};

/**
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
    const { error } = emailValidationSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    const { email } = req.body;

    const response = await userService.send2faCode(email);
    const { user, token } = response;
    return res.status(200).json({
      status: 200,
      message: "Two factor code sent",
      email: user.email,
      twoFactor: true,
      token,
    });
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

    const { token, code } = req.body;

    const user = await userService.verify2faCode(token, code);
    req.user = user;
    // return success("verified", user, 200, res);
    next();
  } catch (error) {
    // console.log(error);
    // res.status(500).json({ error: error.message });
    next(error);
  }
};

export const fetchAllUser = async (req: Request, res: Response) => {
  try {
    const users = await userService.fetchAllUser();
    return success("Fetched successfully", users, 200, res);
  } catch (error) {
    return res.status(500).json({ error });
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
    if (!findUser) {
      throw new InvalidInput("User not found");
    }
    return success("Fetched successfully", findUser, 200, res);
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
    const findUser = await userService.deleteUserById(userId);
    if (!findUser) {
      throw new InvalidInput("User not found");
    }
    return success("Deleted successfully", findUser, 200, res);
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
    const user = await userService.updateUserById(req.body, email);
    return success("User details updated", user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const loginResponse = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = req.user as IUser;

    const token = await generateBearerToken(user);

    res.header("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      status: 200,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          roleId: user.roleId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: user.isVerified,
          twoFactorAuth: user.twoFactorAuth,
          isSeller: user.isSeller,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
};

export const setIsSeller = async (
  req: Request,
  res: Response,
) => {
  try {
    const { error } = tokenValidationSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map(
        (detail: { message: string }) => detail.message
      );
      throw new InvalidInput(errorMessages);
    }
    const { token } = req.body;
    const user = await userService.setIsSeller(token);
    if (user) {
      return success("User set as seller", user, 200, res);
    }
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
};
