import { IUserSignUp } from "./../../interfaces/user/userSignupInterface";
import User from "../../models/User";
import { Response } from "express";
import {
  comparePassword,
  errorResponse,
  generateFourDigitPassword,
  generateToken,
  hashPassword,
  IUserPayload,
  sendVerificationEmail,
  success,
  verifyToken,
} from "../../utils/index";
import axios from "axios";

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
 * @param res
 * @param token
 * @returns
 */
export const verifyUserservice = async (res: Response, token: string) => {
  const decodedUser = verifyToken(token);

  if (!decodedUser) {
    return errorResponse("Invalid token", 401, res);
  }

  try {
    const findUser = await findUserByEmail(decodedUser.email);

    if (!findUser) {
      return errorResponse("Invalid token", 401, res);
    }

    if (findUser.isVerified) {
      return errorResponse("Account already verify", 401, res);
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
    return errorResponse("An error occurred", 500, res);
  }
};
/**
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
 * @param token
 * @param res
 * @returns
 */
export const changeEmailService = async (token: string, res: Response) => {
  const decodedUser = verifyToken(token);

  if (!decodedUser) {
    return errorResponse("Invalid token", 401, res);
  }

  try {
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
/**
 * @param body
 * @param res
 * @param user
 * @returns
 */
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
/**
 * @param email
 * @param res
 * @returns
 */
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
/**
 * @param token
 * @param newPassword
 * @param res
 * @returns
 */
export const restPasswordService = async (
  token: string,
  newPassword: string,
  res: Response
) => {
  const decodedUser = verifyToken(token);

  if (!decodedUser) {
    return errorResponse("Invalid token", 401, res);
  }

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

/**
 * @param token
 * @param res
 * @returns
 */
export const revalidateLoginService = async (token: string, res: Response) => {
  const decodedUser = verifyToken(token);

  if (!decodedUser) {
    return errorResponse("Invalid token", 401, res);
  }

  const user = await User.findByPk(decodedUser.id);

  if (!user) {
    return errorResponse("User not found", 404, res);
  }

  res.header("Authorization", `Bearer ${token}`);

  return success(
    "Login successful",
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isVerified: user.isVerified,
      twoFactorAuth: user.twoFactorAuth,
    },
    200,
    res
  );
};
/**
 * @param email
 * @param res
 * @returns
 */

export const enable2faService = async (email: string, res: Response) => {
  const findUser = await findUserByEmail(email);

  if (!findUser) {
    return errorResponse("User not found", 404, res);
  }
  findUser.twoFactorAuth = true;
  await findUser.save();

  return success(
    "Two factor authentication enabled",
    {
      id: findUser.id,
      email: findUser.email,
    },
    201,
    res
  );
};

export const send2faCodeService = async (user: any, res: Response) => {
  const findUser = await findUserByEmail(user.email);
  try {
    if (!findUser) {
      return errorResponse("User not found", 404, res);
    }
    const code = await generateFourDigitPassword();
    findUser.twoFACode = code;

    await findUser.save();
    const response = await axios.post(process.env.EMAIL_SERVICE_2FA_URL, {
      recipient: findUser.email,
      name: findUser.firstName,
      code,
    });
    if (response.status === 200) {
      return success("Two factor code send", null, 200, res);
    }
    return errorResponse("email not sent", 500, res);
  } catch (err) {
    return errorResponse("Internal Server Error", 500, res);
  }
};

/**
 *
 * @param code
 * @param res
 * @returns
 */
export const verify2faCodeService = async (code: string, res: Response) => {
  const findCode = await User.findOne({ where: { twoFACode: code } });
  if (!findCode) {
    return errorResponse("Code not found", 404, res);
  }
  findCode.twoFACode = null;
  await findCode.save();
  return success(
    "Two factor code verified",
    { id: findCode.id, email: findCode.email },
    200,
    res
  );
};
/**
 * 
 * @param res 
 * @returns 
 */
export const fetchAllUserService = async (res: Response) => {
  try {
    const users = await User.findAll();
    return success("Fetched successfully", users, 200, res);
  } catch (error) {
    return errorResponse("Internal Server Error", 500, res);
  }
};
