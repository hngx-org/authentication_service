const Joi = require('joi');

const schema = Joi.object({
  token: Joi.string().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

const changePassword = (req, res, next) => {
  const { token, oldPassword, newPassword } = req.body;

  const { error } = schema.validate({ token, oldPassword, newPassword });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ messages: errorMessages });
  }

  next();
};

module.exports = changePassword;