import { IUserSignUp } from "./../../interfaces/user/userSignupInterface";
import User from "../../models/User";
import { Response } from "express";
import {
  IUserPayload,
  comparePassword,
  errorResponse,
  generateToken,
  hashPassword,
  sendVerificationEmail,
  success,
  verifyToken,
} from "../../utils/index";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const findUser = await User.findOne({ where: { email } });
    return findUser || null;
  } catch (err) {
    throw new Error("Error finding user by email: " + err.message);
  }
};

export const signUpService = async (body: IUserSignUp, res: Response) => {
  const { firstName, lastName, email, password } = body;

  try {
    const findUser = await findUserByEmail(email);

    if (findUser) {
      // User already exists, return a conflict response
      return errorResponse("User already exists", 409, res);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    // Generate token and send email
    const payload: IUserPayload = {
      email: newUser.email,
      id: newUser.id,
      firstName: newUser.firstName,
    };
    const token = generateToken(payload);
    sendVerificationEmail(newUser.firstName, newUser.email, token);

    // Return a success response
    return success(
      "Account created successfully",
      {
        id: newUser.id,
        email: newUser.email,
      },
      201,
      res
    );
  } catch (err) {
    return errorResponse("Internal Server Error", 500, res);
  }
};
/**
 *
 * @param email
 * @param password
 * @param res
 * @returns
 */
export const loginUserService = async (
  email: string,
  password: string,
  res: Response
) => {
  try {
    const findUser = await findUserByEmail(email);

    if (!findUser) {
      return errorResponse("Invalid username or password", 403, res);
    }

    if (findUser.isVerified === false) {
      return errorResponse("Email not verified", 403, res);
    }

    const isMatch = await comparePassword(password, findUser.password);

    if (!isMatch) {
      return errorResponse("Invalid username or password", 403, res);
    }

    const payload: IUserPayload = {
      email: findUser.email,
      id: findUser.id,
      twoFactorAuth: findUser.twoFactorAuth,
      isVerified: findUser.isVerified,
    };

    const token = await generateToken(payload);
    return success(
      "Login successfully",
      {
        id: findUser.id,
        email: findUser.email,
        accessToken: token,
      },
      200,
      res
    );
  } catch (err) {
    return errorResponse("Internal Server Error", 500, res);
  }
};
/**
 *
 * @param res
 * @param token
 * @returns
 */
export const verifyUserservice = async (res: Response, token: string) => {
  try {
    const decodedUser = verifyToken(token);
    const findUser = await findUserByEmail(decodedUser.email);

    if (!findUser) {
      return errorResponse("Invalid token", 401, res);
    }

    findUser.isVerified = true;
    await findUser.save();
    return success(
      "Account activated successfully",
      {
        id: findUser.id,
        email: findUser.email,
      },
      201,
      res
    );
  } catch (err) {
    return errorResponse("Internal Server Error", 500, res);
  }
};
/**
 *
 * @param email
 * @param res
 * @returns
 */
export const resendVerificationService = async (
  email: string,
  res: Response
) => {
  try {
    const findUser = await findUserByEmail(email);

    if (!findUser) {
      return errorResponse("User not found", 404, res);
    }

    if (findUser.isVerified === true) {
      return errorResponse("User already verified", 403, res);
    }

    const payload: IUserPayload = {
      email: findUser.email,
      id: findUser.id,
      firstName: findUser.firstName,
    };
    const token = generateToken(payload);
    sendVerificationEmail(findUser.firstName, findUser.email, token);
    return success(
      "Verification email sent successfully",
      {
        id: findUser.id,
        email: findUser.email,
        token,
      },
      200,
      res
    );
  } catch (error) {
    return errorResponse("Internal Server Error", 500, res);
  }
};
/**
 *
 * @param email
 * @param res
 * @returns
 */
export const checkEmailService = async (email: string, res: Response) => {
  try {
    const findUser = await findUserByEmail(email);

    if (findUser) {
      return errorResponse("Email already in use", 403, res);
    }
    return success("Email is available for use", { email: email }, 200, res);
  } catch (err) {
    return errorResponse("Internal Server Error", 500, res);
  }
};
/**
 *
 * @param email
 * @param res
 * @returns
 */
export const changeEmailLinkService = async (email: string, res: Response) => {
  try {
    const findUser = await findUserByEmail(email);

    if (!findUser) {
      return errorResponse("Email not found", 404, res);
    }

    const payload: IUserPayload = {
      email: findUser.email,
      id: findUser.id,
    };

    const token = await generateToken(payload);
    sendVerificationEmail(findUser.firstName, findUser.email, token);
    return success(
      "Email change request link sent successfully",
      {
        id: findUser.id,
        email: findUser.email,
      },
      200,
      res
    );
  } catch (err) {
    return errorResponse("Internal Server Error", 500, res);
  }
};
/**
 *
 * @param token
 * @param res
 * @returns
 */
export const changeEmailService = async (token: string, res: Response) => {
  try {
    const decodedUser = verifyToken(token);

    const findUser = await findUserByEmail(decodedUser.email);

    if (findUser) {
      return errorResponse("Email already in use", 409, res);
    }

    findUser.email = decodedUser.email;
    await findUser.save();
    return success(
      "Email changed successfully",
      {
        id: findUser.id,
        email: findUser.email,
      },
      200,
      res
    );
  } catch (err) {
    return errorResponse("Internal Server Error", 500, res);
  }
};

export const changePasswordService = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
) => {
  const { currentPassword, newPassword } = body;

  const findUser = await User.findByPk(user.id);

  if (!findUser) {
    return errorResponse("User not found", 404, res);
  }

  const matchPassword = await comparePassword(
    currentPassword,
    findUser.password
  );
  if (!matchPassword) {
    return errorResponse("invalid current password", 403, res);
  }
  findUser.password = await hashPassword(newPassword);
  await findUser.save();
  return success(
    "Password changed successfully",
    {
      id: findUser.id,
      email: findUser.email,
    },
    201,
    res
  );
};

export const forgotPasswordService = async (email: string, res: Response) => {
  const findUser = await findUserByEmail(email);

  if (!findUser) {
    return errorResponse("User not found", 404, res);
  }

  if (findUser.isVerified === false) {
    return errorResponse("Account not verified not found", 403, res);
  }

  // TODO send resent link
  const payload: IUserPayload = {
    email: findUser.email,
    id: findUser.id,
    firstName: findUser.firstName,
  };
  const token = await generateToken(payload);
  sendVerificationEmail(findUser.firstName, findUser.email, token);
  return success(
    "Forgot password link send successfully",
    {
      id: findUser.id,
      email: findUser.email,
    },
    200,
    res
  );
};

export const restPasswordService = async (
  token: string,
  newPassword: string,
  res: Response
) => {
  const decodedUser = verifyToken(token);

  const findUser = await findUserByEmail(decodedUser.email);

  if (!findUser) {
    return errorResponse("User not found", 404, res);
  }

  findUser.password = await hashPassword(newPassword);
  await findUser.save();
  return success(
    "Password change successfully",
    {
      id: findUser.id,
      email: findUser.email,
    },
    200,
    res
  );
};
