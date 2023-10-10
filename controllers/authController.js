const Joi = require("joi");
const User = require("../models/Users");

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
});

const forgotPassword = (req, res) => {
  const { error } = forgotPasswordSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email } = req.body;
  // ... Implement forgot password functionality here
  res.status(200).json({ message: "Reset password link sent successfully." });
};

const resetPassword = (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { token, password } = req.body;
  // ... Implement reset password functionality here
  res.status(200).json({ message: "Password reset successfully." });
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
