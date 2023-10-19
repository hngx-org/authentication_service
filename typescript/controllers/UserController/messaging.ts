/* eslint-disable camelcase */
import { IUser } from '../../@types';
import axios from 'axios';

// const { EMAIL_SERVICE_URL, AUTH_FRONTEND_URL } = process.env;
const {
  AUTH_FRONTEND_URL,
  EMAIL_SERVICE_VERIFY_EMAIL_URL,
  VERIFY_EMAIL_ENDPOINT_LIVE,
  EMAIL_SERVICE_PASSWORD_RESET_URL,
  PASSWORD_RESET_SUCCESS_URL,
  EMAIL_SERVICE_WELCOME_URL,
  EMAIL_SERVICE_2FA_URL,
} = process.env;

/**
 *
 * @param recipient
 * @param name
 * @param link
 */
export const sendSignUpNotification = async (user: IUser, token: string) => {
  // const verificationLink = `${AUTH_FRONTEND_URL}/auth/verification-complete?token=${token}`;
  const verificationLink = `${VERIFY_EMAIL_ENDPOINT_LIVE}?token=${token}`;
  const jsonData = {
    recipient: user.email,
    name: user.firstName,
    verification_link: verificationLink,
  };

  try {
    const response = await axios.post(EMAIL_SERVICE_VERIFY_EMAIL_URL, jsonData);
    return response.data;
  } catch (error) {
    // console.error('Error sending notification:', error);
  }
};
/**
 *
 * @param recipient
 * @param name
 * @param link
 */
export const resetPasswordNotification = async (user: IUser, token: string) => {
  // const reset_link = `${AUTH_FRONTEND_URL}/auth/password-reset?token=${token}`;
  const reset_link = `${PASSWORD_RESET_SUCCESS_URL}?token=${token}`;
  const jsonData = {
    name: user.firstName,
    recipient: user.email,
    reset_link,
  };

  try {
    const response = await axios.post(
      EMAIL_SERVICE_PASSWORD_RESET_URL,
      jsonData
    );
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
/**
 *
 * @param recipient
 * @param name
 * @param code
 */
export const twoFactorAuthNotification = async (user: IUser, code: string) => {
  const jsonData = {
    recipient: user.email,
    name: user.firstName,
    code: Number(code),
  };
  try {
    const response = await axios.post(EMAIL_SERVICE_2FA_URL, jsonData);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};
/**
 *
 * @param recipient
 * @param name
 * @param link
 */
export const welcomeEmailNotification = async (user: IUser) => {
  const jsonData = {
    recipient: user.email,
    name: user.firstName,
    call_to_action: AUTH_FRONTEND_URL,
  };

  try {
    const response = await axios.post(EMAIL_SERVICE_WELCOME_URL, jsonData);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};
