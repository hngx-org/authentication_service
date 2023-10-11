const bcrypt = require('bcrypt');
const Joi = require("joi");
const User = require("../models/Users");
const transporter = require('../middleware/mailConfig');
const {
  ResourceNotFound,
  Unauthorized,
  BadRequest,
  Conflict,
  Forbidden,
  ServerError,
} = require("../errors/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  ACCESS_DENIED,
  INVALID_TOKEN,
  MISSING_REQUIRED_FIELD,
  INVALID_REQUEST_PARAMETERS,
  EXISTING_USER_EMAIL,
  EXPIRED_TOKEN,
  CONFLICT_ERROR_CODE,
  THIRD_PARTY_API_FAILURE,
} = require("../errors/httpErrorCodes");

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
});

const forgotPassword = async (req, res) => {
  const { error } = forgotPasswordSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    // 404 Error or custom error handling
    return res
      .status(404)
      .json({ success: false, message: "User not found" });
  }
  const resetCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.token = resetCode;
  await user.save();

  // Send an email with the verification code
  const mailOptions = {
    from: process.env.NODEMAILER_USER, 
    to: email, // User's email address
    subject: 'Password Reset',
    text: `Your password reset code is: ${resetCode}`,
  }; 
  await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset password link sent successfully." });
  } catch (error) {
    // Internal error or custom error handling
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
    try {
  const { token, password } = req.body;
  // ... Implement reset password functionality here
  const user = await User.findOne({ where: { token } });

    if (!user) {
      // 404 Error or custom error handling
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    user.token = null;

    await user.save();

  res.status(200).json({ success: true, message: "Password reset successfully." });
} catch (error) {
  // Internal error or custom error handling
  res.status(500).json({ success: false, message: "Something went wrong" });
}
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ where: { token } });

    if (!user) {
      // 404 Error or custom error handling
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.is_verified = true;
    user.token = null;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    // Internal error or custom error handling
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = { forgotPassword, resetPassword, verifyEmail };
