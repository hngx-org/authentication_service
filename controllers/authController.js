const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/Users");
const transporter = require("../middleware/mailConfig");
const { sendVerificationEmail } = require("../helpers/sendVerificationEmail");
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
  EMAIL_ALREADY_VERIFIED,
} = require("../errors/httpErrorCodes");

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
});

const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});

const resendVerificationCodeSchema = Joi.object({
  email: Joi.string().email().required(),
});

const forgotPassword = async (req, res, next) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);

    if (error) {
      throw new BadRequest(error.message, INVALID_REQUEST_PARAMETERS);
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // 404 Error or custom error handling
      throw new ResourceNotFound("User not found", RESOURCE_NOT_FOUND);
      // return res
      //   .status(404)
      //   .json({ success: false, message: "User not found" });
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.token = resetCode;
    await user.save();

    // Send an email with the verification code
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: email, // User's email address
      subject: "Password Reset",
      text: `Your password reset code is: ${resetCode}`,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset password link sent successfully." });
  } catch (error) {
    // Internal error or custom error handling
    // res.status(500).json({ success: false, message: "Something went wrong" });
    console.log(error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);

    if (error) {
      throw new BadRequest(
        error.details[0].message,
        INVALID_REQUEST_PARAMETERS
      );
      // return res
      //   .status(400)
      //   .json({ success: false, message: error.details[0].message });
    }
    const { token, password } = req.body;
    // ... Implement reset password functionality here
    const user = await User.findOne({ where: { token } });

    if (!user) {
      // 404 Error or custom error handling
      throw new ResourceNotFound("User not found", RESOURCE_NOT_FOUND);
      // return res
      //   .status(404)
      //   .json({ success: false, message: "User not found" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    user.token = null;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    next(error);
    // Internal error or custom error handling
    // res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { error } = verifyEmailSchema.validate(req.params);

    if (error) {
      throw new BadRequest(
        error.details[0].message,
        INVALID_REQUEST_PARAMETERS
      );
      // return res
      //   .status(400)
      //   .json({ success: false, message: error.details[0].message });
    }

    const { token } = req.params;

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      throw new Unauthorized("Invalid token", INVALID_TOKEN);
      // return res.status(404).json({ success: false, message: "Invalid token" });
    }

    // FInd the User by ID
    const user = await User.findByPk(decoded.id);
    if (!user) {
      // 404 Error or custom error handling
      throw new ResourceNotFound("User not found", RESOURCE_NOT_FOUND);
      // return res
      //   .status(404)
      //   .json({ success: false, message: "User not found" });
    }

    // CHeck if the user is already verified
    if (user.is_verified) {
      // 404 Error or custom error handling
      throw new BadRequest(
        "Email already verified. please login",
        EMAIL_ALREADY_VERIFIED
      );
      // return res.status(404).json({
      //   success: false,
      //   message: "Email already verified. Please login",
      // });
    }

    // Mark user as verified
    user.is_verified = true;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
    // Internal error or custom error handling
    // res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const resendVerificationCode = async (req, res, next) => {
  try {
    // Validate email format
    const { error } = resendVerificationCodeSchema.validate(req.body);
    if (error) {
      throw new BadRequest(
        error.details[0].message,
        INVALID_REQUEST_PARAMETERS
      );
    }

    const { email } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (user) {
      // Check if user has already verified their Email
      if (user.is_verified) {
        throw new BadRequest(
          "Email already verified. please login",
          EMAIL_ALREADY_VERIFIED
        );
      }

      // Encrypt user id in JWT and send
      const jwt_payload = {
        id: user.id,
      };
      const verificationToken = jwt.sign(jwt_payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Send verification link email to user
      await sendVerificationEmail(
        user.first_name,
        user.email,
        verificationToken
      );

      res.status(200).json({
        status: 200,
        success: true,
        message: "Verification code has been resent to email.",
      });
    } else {
      throw new ResourceNotFound("User not found.", RESOURCE_NOT_FOUND);
      // return res.json("User not found ");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationCode,
};
