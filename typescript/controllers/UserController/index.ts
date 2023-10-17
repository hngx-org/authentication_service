import {
  changePasswordSchema,
  emailSchema,
  enable2faSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./../../utils/validation";
import { Request, Response } from "express";
import User from "../../models/User";
import {
  errorResponse,
  generateFourDigitPassword,
  success,
  verifyToken,
} from "../../utils";
import axios from "axios";
import {
  changeEmailLinkService,
  changeEmailService,
  changePasswordService,
  checkEmailService,
  forgotPasswordService,
  loginUserService,
  resendVerificationService,
  restPasswordService,
  signUpService,
  verifyUserservice,
} from "../../services/UserService/index";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const findUser = await User.findOne({ where: { email } });
    return findUser || null;
  } catch (error) {
    throw new Error("Error finding user by email: " + error.message);
  }
};
/**
 * @param req
 * @param res
 * @returns
 */
export const signUp = async (req: Request, res: Response) => {
  const result = registerSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 409, res);
  }

  const user = await signUpService(req.body, res);
  if (!user) {
    return errorResponse("An error occurred", 500, res);
  }
};

/**
 * @param req
 * @param res
 */
export const loginUser = async (req: Request, res: Response) => {
  const result = loginSchema.validate(req.body);
  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  const { email, password } = req.body;

  const user = await loginUserService(email, password, res);
  if (!user) {
    return errorResponse("An error occurred", 500, res);
  }
};
/**
 * @param req
 * @param res
 * @returns
 */
export const verifyUser = async (req: Request, res: Response) => {
  const { token } = req.params;
  return await verifyUserservice(res, token);
};

export const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = emailSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  return await resendVerificationService(email, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const checkEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = emailSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  return await checkEmailService(email, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const changeEmailLink = async (req: Request, res: Response) => {
  const result = emailSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  const { email } = req.body;
  return await changeEmailLinkService(email, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const changeEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) {
    return errorResponse("Provide token", 401, res);
  }
  return await changeEmailService(token, res);
};

/**
 * @param req
 * @param res
 * @returns
 */
export const changePassword = async (req: Request, res: Response) => {
  const result = changePasswordSchema.validate(req.body);
  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  return await changePasswordService(req.body, res, req.user);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = emailSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  return await forgotPasswordService(email, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const restPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const result = resetPasswordSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  return await restPasswordService(token, newPassword, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const revalidateLogin = async (req: Request, res: Response) => {
  const { token } = req.params;

  const decodedUser = verifyToken(token);

  const { id } = decodedUser;
  const user = await User.findByPk(id);
  if (!user) {
    res.status(404).json({ message: "user not found" });
  }

  res.header("Authorization", `Bearer ${token}`);

  return res.status(200).json({
    status: 200,
    message: "Login successful",
    token,
    data: {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
        twoFactorAuth: user.twoFactorAuth,
      },
    },
  });
};
/**
 * @param req
 * @param res
 * @returns
 */
export const enable2fa = async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = enable2faSchema.validate(req.body);

  if (result.error) {
    return res.status(400).json({ errors: result.error.details });
  }

  const findUser = await findUserByEmail(email);

  if (!findUser) {
    return res.status(404).json({
      status: 404,
      message: "User not found",
    });
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

export const send2faCode = async (req: Request, res: Response) => {
  // TODO PROTECT IT WITH AUTH MIDDLEWARE
  const findUser = await findUserByEmail("email");
  try {
    if (!findUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const code = await generateFourDigitPassword();
    const response = await axios.post(process.env.EMAIL_SERVICE_2FA_URL, {
      recipient: findUser.email,
      name: findUser.firstName,
      code,
    });
    if (response.status === 200) {
      return success("Two factor code send", null, 200, res);
    }
    return res.status(500).json({ message: "email not sent" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
