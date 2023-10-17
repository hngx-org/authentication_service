import userService from "../../services/UserService";
import {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verify2FSchema,
  updateUserSchema,
} from "./validation";
import { Request, Response } from "express";
import { errorResponse } from "../../utils";
/**
 * @param req
 * @param res
 * @returns
 */
// TODO, findbt email, id, checkmail etc
export const signUp = async (req: Request, res: Response) => {
  const result = registerSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  const user = await userService.signUp(req.body, res);
  // const user = await signUpService(req.body, res);
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

  const user = await userService.login(req.body, res);
  // const user = await loginUserService(email, password, res);

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
  return await userService.verifyUser(token, res);
};
/**
 *
 * @param req
 * @param res
 * @returns
 */
export const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = emailSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  return await userService.resendVerification(email, res);
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
  return await userService.checkEmail(email, res);
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
  return await userService.changeEmailLink(email, res);
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

  return await userService.changeEmail(token, res);
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

  const user = req.user as any;
  return await userService.changePassword(req.body, user.id, res);
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

  return await userService.forgotPassword(email, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const result = resetPasswordSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  return await userService.resetPassword(token, newPassword, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const revalidateLogin = async (req: Request, res: Response) => {
  const { token } = req.params;
  return await userService.revalidateLogin(token, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const enable2fa = async (req: any, res: Response) => {
  const { email } = req.user;

  return await userService.enable2fa(email, res);
};
/**
 *
 * @param req
 * @param res
 * @returns
 */
export const send2faCode = async (req: any, res: Response) => {
  const { email } = req.user;
  return await userService.send2faCode(email, res);
};

export const verify2faCode = async (req: Request, res: Response) => {
  const result = verify2FSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }

  const { code } = req.body;

  return await userService.resendVerification(code, res);
};

export const fetchAllUser = async (req: Request, res: Response) => {
  return await userService.fetchAllUser(res);
};

export const findUserById = async (req: any, res: Response) => {
  const { userId } = req.params;
  return await userService.findUserById(userId, res);
};

export const deleteUserById = async (req: any, res: Response) => {
  const { userId } = req.params;
  return await userService.deleteUserById(userId, res);
};

export const updateUserById = async (req: Request | any, res: Response) => {
  const result = updateUserSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  const { email } = req.user;
  return await userService.updateUserById(req.body, email, res);
};
