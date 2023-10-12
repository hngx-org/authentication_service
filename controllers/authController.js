const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/Users");
const axios = require('axios')

const {
  ResourceNotFound,
  Unauthorized,
  BadRequest,
} = require("../errors/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  INVALID_TOKEN,
  INVALID_REQUEST_PARAMETERS,
  EMAIL_ALREADY_VERIFIED,
} = require("../errors/httpErrorCodes");

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required().equal(Joi.ref("newPassword")),
});

const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});

const sendResetPasswordEmail = async (email, resetLink, username) => {
  try {
    const response = await axios.post('https://team-titan.mrprotocoll.me/api/v1/user/password-reset', {
      "recipient": email,
      "name": username,
      "reset_link": resetLink
    });

    if (response.data.status === 200 && response.data.message === "Successful") {
     return "Successful"
    } 
      throw new Forbidden("Unable to send email", INVALID_REQUEST_PARAMETERS)
  } catch (error) {
    throw new ServerError("Unable to send email", INVALID_REQUEST_PARAMETERS)
  }
};



const forgotPassword = async (req, res,next) => {
  try {
  const { error } = forgotPasswordSchema.validate(req.body);

  if (error) {
    throw new BadRequest(error.message, INVALID_REQUEST_PARAMETERS);
  }
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new ResourceNotFound("User not found", RESOURCE_NOT_FOUND);
    }

   if (user.is_verified === false) {
       throw new ResourceNotFound("User not verified", RESOURCE_NOT_FOUND);
    }
  
  const payload = { id: user.id, email: user.email };
  const resetToken = await jwt.sign(payload, process.env.JWT_SECRET);

    const url = `${process.env.FRONT_END_URL}/reset-password?token=${resetToken}`;
     user.token = resetToken;
    await user.save();
      // Send emails
    await sendResetPasswordEmail(user.email, url, user.username);
  return res.status(200).json({ success: true, message: "Password reset link successfully.", user });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
  const { error } = resetPasswordSchema.validate(req.body);

  if (error) {
    throw new BadRequest(error.details[0].message, INVALID_REQUEST_PARAMETERS);
  }
    const { password } = req.body;

    const user = await User.findOne({ where: { token: req.params.token } });

    if (!user) {
      throw new ResourceNotFound("User not found", RESOURCE_NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    user.token = null;
    await user.save();
    res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    next(error)
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { error } = verifyEmailSchema.validate(req.params);

    if (error) {
      throw new BadRequest(error.details[0].message, INVALID_REQUEST_PARAMETERS);
    }

    const { token } = req.params;

    // Verify JWT token
    let decoded;
    try {
      decoded = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      throw new Unauthorized("Invalid token", INVALID_TOKEN);
    }

    // FInd the User by ID
    const user = await User.findByPk(decoded.id);
    if (!user) {
      // 404 Error or custom error handling
      throw new ResourceNotFound("User not found",RESOURCE_NOT_FOUND);
    }

    // CHeck if the user is already verified
    if (user.is_verified) {
      // 404 Error or custom error handling
      throw new BadRequest("Email already verified. please login",EMAIL_ALREADY_VERIFIED);
    }

    // Mark user as verified
    user.is_verified = true;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { forgotPassword, resetPassword, verifyEmail };