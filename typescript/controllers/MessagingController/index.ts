import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";

interface User {
  id: string;
  firstName: string;
  email: string;
}

const createJwtToken = (user: User): string => {
  const { JWT_SECRET } = process.env;
  const jwtPayload = {
    id: user.id,
    firstName: user.firstName,
    email: user.email,
  };
  return jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: 600 });
};

/**
 *
 * @param emailServiceUrl
 * @param data
 * @returns
 */
const sendEmail = async (
  emailServiceUrl: string,
  data: any
): Promise<boolean> => {
  try {
    const response = await axios.post(emailServiceUrl, data);
    return response.status === 200;
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false;
  }
};

/**
 * Send reset password email
 * @param req
 * @param res
 */

const sendPasswordResetEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { EMAIL_SERVICE_PASSWORD_RESET_URL, PASSWORD_RESET_SUCCESS_URL } =
    process.env;
  const { user } = req as any;

  const token = createJwtToken(user);
  const emailServiceUrl = EMAIL_SERVICE_PASSWORD_RESET_URL as string;
  const passwordResetLink = `${PASSWORD_RESET_SUCCESS_URL}?token=${token}`;

  const emailSent = await sendEmail(emailServiceUrl, {
    recipient: user.email,
    name: user.firstName,
    reset_link: passwordResetLink,
  });

  if (emailSent) {
    res
      .status(200)
      .json({ status: 200, message: "Password reset link sent successfully" });
  } else {
    res.status(500).json({ status: 500, message: "Email not sent" });
  }
};

/**
 * Resent email verification
 * @param req
 * @param res
 */
const resendVerification = async (
  req: Request | any,
  res: Response
): Promise<void> => {
  const {
    EMAIL_SERVICE_VERIFY_EMAIL_URL,
    VERIFY_EMAIL_ENDPOINT_LIVE,
    VERIFY_EMAIL_ENDPOINT_DEV,
    NODE_ENV,
  } = process.env;
  const user = req.user as User | undefined;

  if (!user) {
    res.status(401).json({ status: 401, message: "User not found" });
  }

  const { id, firstName, email } = req.user;

  const token = createJwtToken({ id, firstName, email });
  const emailServiceUrl = EMAIL_SERVICE_VERIFY_EMAIL_URL as string;
  const verificationLink =
    NODE_ENV === "production"
      ? `${VERIFY_EMAIL_ENDPOINT_LIVE}?token=${token}`
      : `${VERIFY_EMAIL_ENDPOINT_DEV}?token=${token}`;

  const emailSent = await sendEmail(emailServiceUrl, {
    recipient: email,
    name: firstName,
    verification_link: verificationLink,
  });

  if (emailSent) {
    res.status(200).json({
      status: 200,
      message:
        "Verification email resent. Please check your email for the verification link.",
      user: req.user,
    });
  } else {
    res.status(500).json({ status: 500, message: "Email not sent" });
  }
};

/**
 *  Send sign up email
 * @param req
 * @param res
 */
const sendSignUpEmail = async (
  req: Request | any,
  res: Response
): Promise<void> => {
  const {
    EMAIL_SERVICE_VERIFY_EMAIL_URL,
    VERIFY_EMAIL_ENDPOINT_LIVE,
    VERIFY_EMAIL_ENDPOINT_DEV,
    NODE_ENV,
  } = process.env;

  const user = req.user as User | undefined;
  if (!user) {
    res.status(401).json({ status: 401, message: "User not found" });
  }
  const { id, firstName, email } = req.user;

  const token = createJwtToken({ id, firstName, email });
  const emailServiceUrl = EMAIL_SERVICE_VERIFY_EMAIL_URL as string;
  const verificationLink =
    NODE_ENV === "production"
      ? `${VERIFY_EMAIL_ENDPOINT_LIVE}?token=${token}`
      : `${VERIFY_EMAIL_ENDPOINT_DEV}?token=${token}`;

  const emailSent = await sendEmail(emailServiceUrl, {
    recipient: email,
    name: firstName,
    verification_link: verificationLink,
  });

  if (emailSent) {
    res.status(200).json({
      status: 200,
      message:
        "User created successfully. Please check your email to verify your account",
      user: req.user,
    });
  } else {
    res.status(500).json({ status: 500, message: "Email not sent" });
  }
};

/**
 * Send welcome email
 * @param name
 * @param recipient
 * @returns
 */
const sendWelcomeMail = async (
  name: string,
  recipient: string
): Promise<string> => {
  const { EMAIL_SERVICE_WELCOME_URL, AUTH_FRONTEND_DASHBOARD_URL } =
    process.env;
  const emailServiceUrl = EMAIL_SERVICE_WELCOME_URL as string;
  const redirectLink = AUTH_FRONTEND_DASHBOARD_URL as string;

  const emailSent = await sendEmail(emailServiceUrl, {
    name,
    recipient,
    call_to_action: redirectLink,
  });
  return emailSent
    ? "Welcome email sent successfully."
    : "Welcome email not sent successfully.";
};

export {
  sendPasswordResetEmail,
  resendVerification,
  sendSignUpEmail,
  sendWelcomeMail,
};
