// eslint-disable-next-line @typescript-eslint/no-var-requires
const Joi = require('joi');

export const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const emailValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPasssword: Joi.ref('newPassword'),
});

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
  confirmPasssword: Joi.ref('newPassword'),
});

export const tokenValidationSchema = Joi.object({
  token: Joi.string().required(),
});

export const twofaValidationSchema = Joi.object({
  token: Joi.string().required(),
  code: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});
