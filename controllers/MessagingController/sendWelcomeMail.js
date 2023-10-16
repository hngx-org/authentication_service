/*eslint-disable */
const axios = require('axios');
const { logger } = require('../../middleware/mailConfig');
async function sendWelcomeMail(name, recipient) {
  const responsObj = {};
  try {
    const emailServiceUrl = `${process.env.EMAIL_SERVICE_WELCOME_URL}`;
    const redirectLink = `${process.env.AUTH_FRONTEND_URL}`;

    const response = await axios.post(emailServiceUrl, {
      name,
      recipient,
      call_to_action: redirectLink,
    });
    if (response.status === 200) {
      responseObj.success = true;
      responsObj.message = 'email sent';
    } else {
      responsObj.success = false;
      responsObj.message = 'email not sent';
      logger.warn('email not sent');
    }
  } catch (error) {
    responsObj.success = false;
    responsObj.message = 'email not sent';
    responsObj.error = error;
    logger.error('email not sent');
  }
}
module.exports = { sendWelcomeMail };
