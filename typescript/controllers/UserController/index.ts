import { Request, Response } from "express";
import User from "../../models/User";
import sendVerificationEmail, {
  IUserPayload,
  comparePassword,
  generateToken,
  hashPassword,
  success,
  verifyToken,
} from "../../utils";
import Joi from "Joi";

const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const enable2faSchema = Joi.object({
  email: Joi.string().email().required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPasssword: Joi.ref("newPassword"),
});

const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().required(),
  confirmPasssword: Joi.ref("newPassword"),
});

export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const findUser = await User.findOne({ where: { email } });
    return findUser || null;
  } catch (error) {
    throw new Error("Error finding user by email: " + error.message);
  }
};
/**
 *
 * @param req
 * @param res
 * @returns
 */
export const createUser = async (req: Request, res: Response) => {
  const result = registerSchema.validate(req.body);

  if (result.error) {
    return res.status(400).json({ errors: result.error.details });
  }
  const { firstName, lastName, email, password } = req.body;

  try {
    const findUser = await findUserByEmail(email);

    if (findUser) {
      return res.status(409).json({
        status: 409,
        message: "User already exists",
        error: "Conflict",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      const payload: IUserPayload = {
        email: newUser.email,
        id: newUser.id,
        firstName: newUser.firstName,
      };
      //  Generate token and send email
      const token = generateToken(payload);
      sendVerificationEmail(newUser.firstName, newUser.email, token);

      return success(
        "Account created successfully",
        {
          id: newUser.id,
          email: newUser.email,
        },
        201,
        res
      );
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "An error occcured",
      error: error,
    });
  }
};

/**
 *
 * @param req
 * @param res
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = loginSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ errors: result.error.details });
  }

  try {
    const findUser = await findUserByEmail(email);

    if (!findUser) {
      return res.status(409).json({
        status: 403,
        message: "Invalid username or password",
        error: "Forbidden",
      });
    }

    if (findUser.isVerified === false) {
      return res.status(403).json({
        status: 403,
        message: "Account not verified",
        error: "Forbidden",
      });
    }

    const isMatch = await comparePassword(password, findUser.password);

    if (!isMatch) {
      return res.status(409).json({
        status: 409,
        message: "Invalid username or password",
        error: "Conflict",
      });
    }

    const payload: IUserPayload = {
      email: findUser.email,
      id: findUser.id,
    };

    const token = await generateToken(payload);
    req.user = findUser;
    return res.status(200).json({
      message: "Login successfully",
      data: {
        id: findUser.id,
        email: findUser.email,
      },
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
/**
 *
 * @param req
 * @param res
 * @returns
 */
export const verifyUser = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decodedUser = verifyToken(token);

    const findUser = await findUserByEmail(decodedUser.email);

    if (!findUser) {
      return res.status(401).json({ status: 401, message: "Invalid token" });
    }

    findUser.isVerified = true;
    await findUser.save();
    return res.status(201).json({
      message: "Account activated successfully",
      data: {
        id: findUser.id,
        email: findUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // const findUser = await User.findOne({
    //   where: { email },
    // });
    const findUser = await findUserByEmail(email);

    if (!findUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    if (findUser.isVerified === true) {
      return res.status(403).json({
        status: 403,
        message: "User already verified",
      });
    }

    const payload: IUserPayload = {
      email: findUser.email,
      id: findUser.id,
      firstName: findUser.firstName,
    };
    const token = generateToken(payload);
    sendVerificationEmail(findUser.firstName, findUser.email, token);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
/**
 *
 * @param req
 * @param res
 * @returns
 */
export const checkEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = emailSchema.validate(req.body);

  if (result.error) {
    return res.status(400).json({ errors: result.error.details });
  }

  try {
    const findUser = await findUserByEmail(email);

    if (findUser) {
      return res.status(409).json({
        status: 409,
        message: "Email already in use",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Email is available for use",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
/**
 *
 * @param req
 * @param res
 * @returns
 */
export const changeEmailLink = async (req: Request, res: Response) => {
  try {
    const result = emailSchema.validate(req.body);
    const { email } = req.body;

    if (result) {
      return res.status(400).json({ errors: result.error.details });
    }

    const findUser = await findUserByEmail(email);

    if (!findUser) {
      return res.status(400).json({ message: "User not found." });
    }

    const payload: IUserPayload = {
      email: findUser.email,
      id: findUser.id,
    };

    const token = await generateToken(payload);
    sendVerificationEmail(findUser.firstName, findUser.email, token);

    return success(
      "Email change request successful",
      {
        id: findUser.id,
        email: findUser.email,
      },
      200
    );
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" + err });
  }
};
/**
 *
 * @param req
 * @param res
 * @returns
 */
export const changeEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decodedUser = verifyToken(token);

    const findUser = await findUserByEmail(decodedUser.email);

    if (!findUser) {
      return res.status(401).json({ status: 401, message: "Invalid token" });
    }

    findUser.email = decodedUser.email;
    await findUser.save();
    return res.status(201).json({
      message: "Email changed successfully",
      data: {
        id: findUser.id,
        email: findUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user as string;

  const result = changePasswordSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ errors: result.error.details });
  }
  const findUser = await User.findByPk(userId);

  if (!findUser) {
    return res.status(401).json({ status: 401, message: "Invalid token" });
  }

  const matchPassword = await comparePassword(
    currentPassword,
    findUser.password
  );
  if (!matchPassword) {
    return res
      .status(400)
      .json({ status: 401, message: "invalid current password" });
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
 *
 * @param req
 * @param res
 * @returns
 */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = emailSchema.validate(req.body);

  if (result) {
    return res.status(400).json({ errors: result.error.details });
  }

  const findUser = await findUserByEmail(email);

  if (!findUser) {
    return res.status(400).json({ status: 401, message: "User not found" });
  }

  // TODO send resent link
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
 *
 * @param req
 * @param res
 * @returns
 */
export const restPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const result = resetPasswordSchema.validate(req.body);

  if (result) {
    return res.status(400).json({ errors: result.error.details });
  }

  const decodedUser = verifyToken(token);

  const findUser = await findUserByEmail(decodedUser.email);

  if (!findUser) {
    return res.status(401).json({ status: 401, message: "Invalid token" });
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
 * 
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
 * 
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
