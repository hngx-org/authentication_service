const Joi = require("joi");
const { v4: uuidv4 } = require('uuid');
const User = require("../models/Users");
const transporter = require('../middleware/mailConfig')

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required().equal(Joi.ref("newPassword")),
});

/**
 *  Send forgot Password link
 * @param {body} req 
 * @param {*} res 
 * @returns 
 */
const forgotPassword = async (req, res) => {
 const { email } = req.body;

  const { error } = forgotPasswordSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ 
      message: error.details[0].message,
      statusCode: 400,
       error: "BadRequest" 
      });
  }

  //  Check if email exist in the database reset_token
  const findUser = await User.findOne({where: { email }, attributes: ['id', 'email', 'reset_token']});

  if(!findUser) {
     return res.status(403).json({ 
      message:"Account not found.",
      statusCode: 403,
      error: "Forbidden" 
    });
  }

  const token = uuidv4();
  const resetLink = `${process.env.FRONT_END_URL}/reset-password?token=${token}`;

  findUser.reset_token = token;
  await findUser.save();

// Email template for password reset (service like mailgun is need for full flow)
const emailTemplate = `
  <p>Hello, <br/></p>
  <p>You have requested to reset your password.</p>
  <p>Click the following link to reset your password:</p>
  <a href=${resetLink}>Reset Password</a>
  <p>If you did not request this, please ignore this email.</p>
  <p>Best regards,<br>Zuri Team</p>
`;

try {
   await transporter.sendMail({
    from: '"Zuri" <no-reply@zuri.com>',
    to: email,
    subject: "Reset Password",
    html: emailTemplate, 
  });

 return res.status(200).json({
   message: "Reset password link sent successfully.",
   status: "Success",
   data: {
    id: findUser.id
  }
  });
} catch (error) {
  return res.status(500).json({ success: false, message: "Something went wrong" });
}
};

/**
 *  Reset Password
 * @param {body} req 
 * @param {*} res 
 * @returns 
 */
const resetPassword = async (req, res) => {
  const { newPassword } = req.body;

  const { error } = resetPasswordSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const findToken = await User.findOne({where: {reset_token: req.params.token }, attributes: ['id', 'email', 'reset_token', 'password']});

  if(!findToken) {
     return res.status(403).json({ 
      message:"Invalid token.",
      statusCode: 403,
      error: "Forbidden" 
    });
  }

  try {
    // Updating db
    findToken.password = await bcrypt.hashSync(newPassword, 10);
    findToken.reset_token = null,
    await findToken.save()

    return res.status(201).json({
      message: "Password reset successfully.", 
      status: "Success",
      data: {
        id: findToken.id
      }});
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
  const findUser = await User.findOne({where: {reset_token: req.params.token }, attributes: ['id', 'email', 'reset_token', 'password']});

    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    findUser.is_verified = true;
    findUser.reset_token = null;
    await findUser.save();
    res.status(201).json({ statuus: "Success", message: "Email verified successfully" });
  } catch (error) {
  return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = { forgotPassword, resetPassword, verifyEmail };
