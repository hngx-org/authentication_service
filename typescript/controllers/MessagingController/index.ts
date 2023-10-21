/* eslint-disable camelcase */
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { success } from '../../utils';
import { GenericRequest } from '../../@types';

interface IUser {
  id: string;
  firstName: string;
  email: string;
}
/**
 *
 * @param user
 * @returns
 */
export const createJwtToken = (user: IUser): string => {
  const jwtPayload = {
    id: user.id,
    firstName: user.firstName,
    email: user.email,
  };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
    expiresIn: 600,
  });
};

export const generateVerificationLink = (
  token: string,
  NODE_ENV: string
): string => {
  const { VERIFY_EMAIL_ENDPOINT_LIVE, VERIFY_EMAIL_ENDPOINT_DEV } = process.env;
  const endpoint =
    NODE_ENV === 'production'
      ? VERIFY_EMAIL_ENDPOINT_LIVE
      : VERIFY_EMAIL_ENDPOINT_DEV;
  return `${endpoint}?token=${token}`;
};

/**
 *
 * @param emailServiceUrl
 * @param data
 * @returns
 */
const sendEmail = async (
  emailServiceUrl: string,
  data: Record<string, unknown>
): Promise<boolean> => {
  try {
    const response = await axios.post(emailServiceUrl, data);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

/**
 * Send reset password email
 * @param req
 * @param res
 */

const sendPasswordResetEmail = async (
  req: GenericRequest<IUser>,
  res: Response
): Promise<void> => {
  const { EMAIL_SERVICE_PASSWORD_RESET_URL, PASSWORD_RESET_SUCCESS_URL } =
    process.env;
  const { user } = req;

  //   Generate JWT token
  const token = createJwtToken(user);

  const emailServiceUrl = EMAIL_SERVICE_PASSWORD_RESET_URL as string;
  const passwordResetLink = `${PASSWORD_RESET_SUCCESS_URL}?token=${token}`;

  const emailSent = await sendEmail(emailServiceUrl, {
    recipient: user.email,
    name: user.firstName,
    reset_link: passwordResetLink,
  });

  if (emailSent) {
    success('Password reset link sent successfully', 200);
  } else {
    res.status(500).json({ status: 500, message: 'Email not sent' });
  }
};

/**
 * Resent email verification
 * @param req
 * @param res
 */
const resendVerification = async (
  req: GenericRequest<IUser>,
  res: Response
): Promise<void> => {
  const { EMAIL_SERVICE_VERIFY_EMAIL_URL, NODE_ENV } = process.env;
  const user = req.user as IUser | undefined;

  if (!user) {
    res.status(401).json({ status: 401, message: 'User not found' });
  }

  const { id, firstName, email } = req.user;

  //   Generate JWT token
  const token = createJwtToken({ id, firstName, email });

  // const verificationLink =
  //   NODE_ENV === "production"
  //     ? `${VERIFY_EMAIL_ENDPOINT_LIVE}?token=${token}`
  //     : `${VERIFY_EMAIL_ENDPOINT_DEV}?token=${token}`;
  const emailServiceUrl = EMAIL_SERVICE_VERIFY_EMAIL_URL as string;
  const verificationLink = generateVerificationLink(token, NODE_ENV as string);

  const emailSent = await sendEmail(emailServiceUrl, {
    recipient: email,
    name: firstName,
    verification_link: verificationLink,
  });

  if (emailSent) {
    success(
      'Verification email resent. Please check your email for the verification link',
      req.user,
      200
    );
  } else {
    res.status(500).json({ status: 500, message: 'Email not sent' });
  }
};

/**
 *  Send sign up email
 * @param req
 * @param res
 */
const sendSignUpEmail = async (
  req: GenericRequest<IUser>,
  res: Response
): Promise<void> => {
  const { EMAIL_SERVICE_VERIFY_EMAIL_URL, NODE_ENV } = process.env;

  const user = req.user;
  if (!user) {
    res.status(401).json({ status: 401, message: 'User not found' });
  }
  const { id, firstName, email } = req.user;

  //   Generate JWT token
  const token = createJwtToken({ id, firstName, email });

  const emailServiceUrl = EMAIL_SERVICE_VERIFY_EMAIL_URL as string;
  // const verificationLink =
  //   NODE_ENV === "production"
  //     ? `${VERIFY_EMAIL_ENDPOINT_LIVE}?token=${token}`
  //     : `${VERIFY_EMAIL_ENDPOINT_DEV}?token=${token}`;
  const verificationLink = generateVerificationLink(token, NODE_ENV as string);

  const emailSent = await sendEmail(emailServiceUrl, {
    recipient: email,
    name: firstName,
    verification_link: verificationLink,
  });

  if (emailSent) {
    success(
      'Verification email resent. Please check your email for the verification link',
      req.user,
      200
    );
  } else {
    res.status(500).json({ status: 500, message: 'Email not sent' });
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
    // eslint-disable-next-line camelcase
    call_to_action: redirectLink,
  });
  return emailSent
    ? 'Welcome email sent successfully.'
    : 'Welcome email not sent successfully.';
};

export {
  sendPasswordResetEmail,
  resendVerification,
  sendSignUpEmail,
  sendWelcomeMail,
};
