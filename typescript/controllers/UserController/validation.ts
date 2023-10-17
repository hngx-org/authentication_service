import Joi from "Joi";

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

export const enable2faSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPasssword: Joi.ref("newPassword"),
});

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
  confirmPasssword: Joi.ref("newPassword"),
});

export const verify2FSchema = Joi.object({
  code: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});
