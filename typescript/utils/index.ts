import { Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export interface IUserPayload {
  id: string;
  email: string;
  firstName?: string;
  isVerified?: boolean,
  twoFactorAuth?: boolean

  // Add more user-related properties if needed
}
export function success(
  message: string,
  args: unknown = {} || null,
  statusCode?: number,
  res?: Response
) {
  return res.status(statusCode).json({ message: message, data: args });
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

export const generateToken = (userPayload: IUserPayload): string => {
  const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const verifyToken = (token: string): IUserPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as IUserPayload;
    return decoded;
  } catch (error) {
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

    const response = await axios.post(`${process.env.EMAIL_SERVICE_URL}/api/user/email-verification`, {
      name,
      recipient,
      // eslint-disable-next-line camelcase
      verification_link: verificationLink,
    });


    if (response.status === 200) {
      console.log(response)
      return "Verification email sent successfully.";
    } else {
      return "Failed to send verification email";
    }
  } catch (error) {
    console.log(error)
    return error;
  }
};

export const  generateFourDigitPassword = ()=> {
  const timestamp = Date.now().toString(); 
  const lastFourDigits = timestamp.substr(timestamp.length - 4); // Extract the last 4 digits
  return lastFourDigits;
}
