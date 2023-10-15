const Joi = require('joi');
const User = require('../../models/Users');

const enable2faSchema = Joi.object({
  email: Joi.string().email().required(),
});

const enable2fa = async (req, res) => {
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

  user.update({ two_factor_auth: true });

  return res.status(200).json({
    status: 200,
    message: 'Two factor authentication enabled',
    user: {
      id: user.id,
      firstName: user.first_name,
      email: user.email,
      twoFactorEnabled: user.two_factor_auth,
      isVerified: user.is_verified,
    },
  });
};

module.exports = enable2fa;
