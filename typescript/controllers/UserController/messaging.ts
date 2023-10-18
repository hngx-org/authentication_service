/* eslint-disable camelcase */
import axios from 'axios';
/**
 *
 * @param recipient
 * @param name
 * @param link
 */
export const sendSignUpNotification = async (
  recipient: string,
  name: string,
  link: string
) => {
  const jsonData = {
    recipient: recipient,
    name: name,
    sign_up_notification_link: link,
  };

  try {
    const response = await axios.post(
      'http://staging.zuri.team/api/messaging/api/v1/user/email-verification',
      jsonData
    );
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
export const resetPasswordNotification = async (
  recipient: string,
  name: string,
  link: string
) => {
  const jsonData = {
    recipient: recipient,
    name: name,
    sign_up_notification_link: link,
  };

  try {
    const response = await axios.post(
      'http://staging.zuri.team/api/messaging/api/v1/user/reset-password',
      jsonData
    );
    console.log('Notification sent successfully:', response.data);

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
export const twoFactorAuthNotification = async (
  recipient: string,
  name: string,
  code: string
) => {
  const jsonData = {
    recipient: recipient,
    name: name,
    code: code,
  };

  try {
    const response = await axios.post(
      'http://staging.zuri.team/api/messaging/api/v1/user/twoFactorAuth',
      jsonData
    );
    console.log('Notification sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
/**
 *
 * @param recipient
 * @param name
 * @param link
 */
export const welcomeEmailNotification = async (
  recipient: string,
  name: string,
  link: string
) => {
  const jsonData = {
    recipient: recipient,
    name: name,
    call_to_action: link,
  };

  try {
    const response = await axios.post(
      'http://staging.zuri.team/api/messaging/api/v1/user/welcome-email',
      jsonData
    );
    console.log('Notification sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
