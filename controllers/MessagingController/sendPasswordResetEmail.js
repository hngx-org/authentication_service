const jwt = require('jsonwebtoken');
const axios = require('axios');

const sendPasswordResetEmail = async (req, res) => {
  const {
    EMAIL_SERVICE_PASSWORD_RESET_URL,
    PASSWORD_RESET_ENDPOINT_LIVE,
    PASSWORD_RESET_ENDPOINT_DEV,
    NODE_ENV,
  } = process.env;

  const { user } = req;

  const jwt_payload = {
    id: user.id,
    firstName: user.firstName,
    email: user.email,
  };

  const token = jwt.sign(jwt_payload, process.env.JWT_SECRET);
  const emailServiceUrl = EMAIL_SERVICE_PASSWORD_RESET_URL;
  const passwordResetLink =
    NODE_ENV === 'production'
      ? `${PASSWORD_RESET_ENDPOINT_LIVE}/${token}`
      : `${PASSWORD_RESET_ENDPOINT_DEV}/${token}`;

  try {
    const response = await axios.post(emailServiceUrl, {
      recipient: user.email,
      name: user.firstName,
      reset_link: passwordResetLink,
    });

    if (response.status === 200) {
      return res.status(200).json({
        status: 200,
        message: 'Password reset link sent successfully',
      });
    }

    if (response.status == 422) {
      return res.status(500).json({
        status: 500,
        message: 'Email not sent',
        error: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Email not sent',
      error,
    });
  }
};

module.exports = sendPasswordResetEmail;
