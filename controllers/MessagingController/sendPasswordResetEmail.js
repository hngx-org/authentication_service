const jwt = require('jsonwebtoken');
const axios = require('axios');

const sendPasswordResetEmail = async (req, res) => {
  const { EMAIL_SERVICE_PASSWORD_RESET_URL, PASSWORD_RESET_SUCCESS_URL } =
    process.env;

  const { user } = req;

  const jwt_payload = {
    id: user.id,
    firstName: user.firstName,
    email: user.email,
  };

  const token = jwt.sign(jwt_payload, process.env.JWT_SECRET, {expiresIn: 600});
  const emailServiceUrl = EMAIL_SERVICE_PASSWORD_RESET_URL;
  const passwordResetLink = `${PASSWORD_RESET_SUCCESS_URL}?token=${token}`;

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
