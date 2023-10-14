const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../../models/Users');

const verify2faSchema = Joi.object({
  code: Joi.number().min(100000).max(999999).required(),
});

const verify2fa = async (req, res) => {
  const { error } = verify2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { code, email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'User not found',
    });
  }

  console.log(user.refresh_token);
  console.log(code);

  if (user.refresh_token !== code) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid code',
    });
  }

  await user.update({ refresh_token: null, two_factor_auth: true });

  const jwt_payload = {
    id: user.id,
    firstName: user.first_name,
    email: user.email,
  };

  const token = jwt.sign(jwt_payload, process.env.JWT_SECRET);
  res.header('Authorization', `Bearer ${token}`);

  return res.status(200).json({
    status: 200,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        is_verified: user.is_verified,
        two_factor_auth: user.two_factor_auth,
      },
    },
  });
};

module.exports = verify2fa;
