const Joi = require('joi');
const User = require('../../models/Users');
const { default: axios } = require('axios');

const { EMAIL_SERVICE_2FA_URL } = process.env;

const enable2faSchema = Joi.object({
  email: Joi.string().email().required(),
});

const send2faCode = async (req, res) => {
  const { error } = enable2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'User not found',
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await user.update({ refresh_token: code });

  try {
    const response = await axios.post(EMAIL_SERVICE_2FA_URL, {
      recipient: email,
      name: user.first_name,
      code,
    });

    if (response.status === 200) {
      return res.status(200).json({
        status: 200,
        message: '2fa code sent',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error,
    });
  }
};

module.exports = send2faCode;
