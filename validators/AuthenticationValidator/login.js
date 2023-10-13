const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const login = (req, res, next) => {
  const { email, password } = req.body;

  const { error } = schema.validate({ email, password });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ messages: errorMessages });
  }

  next();
};

module.exports = login;
