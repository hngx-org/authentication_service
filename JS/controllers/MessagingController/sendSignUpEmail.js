const jwt = require('jsonwebtoken');
const axios = require('axios');

const sendSignUpEmail = async (req, res) => {
  const { id, firstName, email } = req.user;
  const { EMAIL_SERVICE_VERIFY_EMAIL_URL, VERIFY_EMAIL_ENDPOINT_LIVE } =
    process.env;

  const jwt_payload = {
    id,
    firstName,
    email,
  };

  const token = jwt.sign(jwt_payload, process.env.JWT_SECRET, {
    expiresIn: 600,
  });
  const emailServiceUrl = EMAIL_SERVICE_VERIFY_EMAIL_URL;
  const verificationLink = `${VERIFY_EMAIL_ENDPOINT_LIVE}?token=${token}`;

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
          'User created successfully. Please check your email to verify your account',
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

module.exports = sendSignUpEmail;
