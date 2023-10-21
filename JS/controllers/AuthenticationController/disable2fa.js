/*eslint-disable */
const Joi = require('joi');
const User = require('../../models/Users');
const jwt = require('jsonwebtoken');

const enable2faSchema = Joi.object({
  token: Joi.string().required(),
});

const disable2fa = async (req, res) => {
  const { error } = enable2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ msg: 'You have to be logged in' });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    }

    user.update({ two_factor_auth: false });

    return res.status(200).json({
      status: 200,
      message: 'Two factor authentication disabled',
    });
  } catch (error) {
    if (error.name && error.name === 'TokenExpiredError')
      return res.status(401).json({
        status: 401,
        message: 'code timer expired',
      });

    return res.status(500).json({
      status: 401,
      message: 'internal server error',
    });
  }
};

module.exports = disable2fa;
