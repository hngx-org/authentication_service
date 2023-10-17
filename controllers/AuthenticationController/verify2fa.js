/*eslint-disable*/
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../../models/Users');

const verify2faSchema = Joi.object({
  token: Joi.string().required(),
  code: Joi.string().alphanum().length(6, 'utf-8'),
});

const verify2fa = async (req, res, next) => {
  const { error } = verify2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { code, token: inToken } = req.body;
  try {
    const { id, code: confirmCode } = jwt.verify(
      inToken,
      process.env.JWT_SECRET,
    );
    console.log(typeof code, typeof confirmCode);
    if (code !== confirmCode)
      return res.status(401).json({
        status: 401,
        message: 'Invalid code',
      });

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    }
    req.user = user;
    return next();
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

module.exports = verify2fa;
