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

};

module.exports = send2faCode;
