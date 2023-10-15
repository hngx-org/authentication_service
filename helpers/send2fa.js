/*eslint-disable */
const axios = require('axios');

require('dotenv').config();

const send2fa = async (user) => {
  const EMAIL_SERVICE_2FA_URL = process.env.EMAIL_SERVICE_2FA_URL;

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const responseObj = { email: user.email, twoFactorAuth: true };

  await user.update({ refresh_token: code });

  try {
    const response = await axios.post(EMAIL_SERVICE_2FA_URL, {
      recipient: user.email,
      name: user.first_name,
      code,
    });

    if (response.status === 200) {
      responseObj.status = 200;
      responseObj.message = 'TWO FACTOR AUTHENTICATION CODE SENT';
    }
  } catch (error) {
    responseObj.status = 500;
    responseObj.message = 'INTERNAL SERVER ERROR';
    responseObj.error = error;
  }
  return responseObj;
};

module.exports = send2fa;
