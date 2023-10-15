const jwt = require('jsonwebtoken');
const axios = require('axios');

const resendVerification = async (req, res) => {
  const { id, firstName, email } = req.user;
  const {
    EMAIL_SERVICE_VERIFY_EMAIL_URL,
    VERIFY_EMAIL_ENDPOINT_LIVE,
    VERIFY_EMAIL_ENDPOINT_DEV,
    NODE_ENV,
  } = process.env;

  const jwt_payload = {
    id,
    firstName,
    email,
  };

  const token = jwt.sign(jwt_payload, process.env.JWT_SECRET);
  const emailServiceUrl = EMAIL_SERVICE_VERIFY_EMAIL_URL;
  const verificationLink =
    NODE_ENV === 'production'
      ? `${VERIFY_EMAIL_ENDPOINT_LIVE}?token=${token}`
      : `${VERIFY_EMAIL_ENDPOINT_DEV}?token=${token}`;

  try {
    const response = await axios.post(emailServiceUrl, {
      recipient: email,
      name: firstName,
      verification_link: verificationLink,
    });

    if (response.status === 200) {
      return res.status(200).json({
        status: 200,
        message:
          'Verification email resent. Please check your email for the verification link.',
        user: req.user,
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

module.exports = resendVerification;
