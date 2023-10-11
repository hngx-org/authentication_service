const Joi = require("joi");
const jwt = require('jsonwebtoken')
const User = require("../models/Users");
const transporter = require('../middleware/mailConfig')
const bcrypt = require('bcrypt');
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
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required().equal(Joi.ref("newPassword")),
});

const generateResetLink = (userId, userEmail) => {
  const payload = { id: userId, email: userEmail };
  const token = jwt.sign(payload, process.env.jwtSecret);
  return `${process.env.FRONT_END_URL}/reset-password?token=${token}`;
};

const sendResetPasswordEmail = async (email, resetLink) => {
  const emailTemplate = `
  <p>Hello, <br/></p>
  <p>You have requested to reset your password.</p>
  <p>Click the following link to reset your password:</p>
  <a href=${resetLink}>Reset Password</a>
  <p>If you did not request this, please ignore this email.</p>
  <p>Best regards,<br>Zuri Team</p>
`;
  await transporter.sendMail({
    from: '"Zuri" <no-reply@zuri-portfolio.com>',
    to: email,
    subject: "Reset Password",
    html: emailTemplate,
  });
  
};
/**
 *  Send forgot Password link
 * @param {body} req 
 * @param {*} res 
 * @returns 
 */
const forgotPassword = async (req, res) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        statusCode: 400,
        error: "BadRequest",
      });
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email }, attributes: ['id', 'email'] });

    if (!user) {
      return res.status(403).json({
        message: "Account not found.",
        statusCode: 403,
        error: "Forbidden",
      });
    }

    if (user.is_verified === false) {
      return res.status(403).json({
        message: "Email not verified.",
        statusCode: 403,
        error: "Forbidden",
      });
    }

    const resetLink = generateResetLink(user.id, user.email);
    await sendResetPasswordEmail(user.email, resetLink);

    return res.status(200).json({
      message: "Reset password link sent successfully.",
      status: "Success",
      data: {
        id: user.id,
        resetLink,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong due to mail service keys not found" });
  }
};

/**
 *  Reset Password
 * @param {body} req 
 * @param {*} res 
 * @returns 
 */
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const { error } = resetPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

     const verifyToken = await jwt.verify(req.params.token, process.env.jwtSecret);

     if(!verifyToken) {
       return res.status(403).json({
        message: "Unauthorized token.",
        statusCode: 403,
        error: "Forbidden"
      });
     }

    // Hash the new password and update the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    findToken.password = hashedPassword;
   const savedUser =  await findToken.save();

    return res.status(201).json({
      message: "Password reset successfully.",
      status: "Success",
      data: {
        id: savedUser.id
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
/**
 *  Verify email
 * @param {token} req 
 * @param {*} res 
 * @returns 
 */
const verifyEmail = async (req, res) => {
  try {
  const verifyToken = await jwt.verify(req.params.token, process.env.jwtSecret);
    if(!verifyToken) {
       return res.status(403).json({
        message: "Unauthorized token.",
        statusCode: 403,
        error: "Forbidden"
      });
    }
  const findUser = await User.findOne({where: {email: verifyToken.email }, attributes: ['id', 'email', 'is_verified']});

    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    findUser.is_verified = true;
    await findUser.save();
   return res.status(201).json({ statuus: "Success", message: "Email verified successfully" });
  } catch (error) {
  return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = { forgotPassword, resetPassword, verifyEmail };

