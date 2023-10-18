import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { ITwoFactorPayload, IUser, ITokenPayload } from '../@types/index';

export function success(
  message: string,
  args: unknown = {} || null,
  statusCode: number = 200,
  res?: Response
) {
  return res.status(statusCode).json({ statusCode, message, data: args });
  // return {
  //   status: 'success',
  //   statusCode: statusCode || 200,
  //   message: message,
  //   data: args,
  // }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export const generateBearerToken = (user: IUser): string => {
  const payload: { id: string } = {
    id: user.id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  return token;
};

export const generateToken = (user: IUser): string => {
  const payload: ITokenPayload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

export const verifyToken = (token: string): ITokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as ITokenPayload;
    return decoded;
  } catch (err) {
    return null;
  }
};

export const verify2faToken = (token: string): ITwoFactorPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as ITwoFactorPayload;

    return decoded;
  } catch (err) {
    return null;
  }
};

export const sendVerificationEmail = async (
  name: string,
  recipient: string,
  token: string
) => {
  try {
    // TODO email link not valid
    const verificationLink = `${process.env.AUTH_FRONTEND_URL}/auth/verification-complete?token=${token}`;

    const response = await axios.post(
      `${process.env.EMAIL_SERVICE_URL}/api/user/email-verification`,
      {
        name,
        recipient,
        // eslint-disable-next-line camelcase
        verification_link: verificationLink,
      }
    );

    if (response.status === 200) {
      return 'Verification email sent successfully.';
    } else {
      return 'Failed to send verification email';
    }
  } catch (error) {
    // return error;
  }
};

export const generateFourDigitPassword = () => {
  const timestamp = Date.now().toString();
  const lastFourDigits = timestamp.substr(timestamp.length - 4); // Extract the last 4 digits
  return lastFourDigits;
};

export const errorResponse = (
  message: string | unknown,
  statusCode: number,
  res?: Response
) => {
  return res.status(statusCode).json({ message: message });
};