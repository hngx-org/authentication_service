/* eslint-disable camelcase */
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { ITwoFactorPayload, IUser, ITokenPayload } from '../@types/index';

export function success(
  message: string,
  args: unknown = {} || null,
  status: number = 200,
  res?: Response
) {
  return res.status(status).json({ status, message, data: args });
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
    expiresIn: 60 * 60 * 24,
  })
  return token;
}

export const generate2faToken = (user: IUser, code: string): string => {
  const payload: ITwoFactorPayload = {
    id: user.id,
    code,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 15 * 60 * 1000,
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
    expiresIn: 600,
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
    const verification_link = `${process.env.AUTH_FRONTEND_URL}/auth/verification-complete?token=${token}`;

    const response = await axios.post(
      `${process.env.EMAIL_SERVICE_URL}/api/user/email-verification`,
      {
        name,
        recipient,
        // eslint-disable-next-line camelcase
        verification_link,
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

export const errorResponse = (
  message: string | unknown,
  status: number,
  res?: Response
) => {
  return res.status(status).json({ status, message });
};
