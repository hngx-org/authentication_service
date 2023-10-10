const bcrypt = require("bcrypt");
const User = require("../models/Users");
const JwtStartegy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const transporter = require("../middleware/mailConfig");
const validator = require("validator");
const Joi = require("joi");

const enable2faSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verify2faSchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().email().required(),
});

async function createUser(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      username: "",
      token: verificationToken,
      refresh_token: "",
      password: hashedPassword,
    });

    req.body.user = newUser.toJSON();

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user.",
      error: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const data = req.body;

    const user = await User.findOne({
      where: { email: data.email },
    });

    if (user) {
      // Check if user has verified their Email
      if (!user.is_verified) {
        return res.status(400).json({
          success: false,
          message: "Please verify your email.",
        });
      }

      const checkPassword = bcrypt.compareSync(data.password, user.password);

      if (!checkPassword) {
        return res.json("Incorrect passsword");
      } else {
        const jwt_payload = {
          id: user.id,
        };
        const token = jwt.sign(jwt_payload, process.env.JWT_SECRET);
        return res.json({
          token: token,
          data: user,
          statusCode: 200,
        });
      }
    } else {
      return res.json("User not found ");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
}

const enable2fa = async (req, res) => {
  const { error } = enable2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email } = req.body;
  const user = await User.findOne({
    where: { email: email },
  });
  if (!user) return res.status(400).json({ message: "User not found" });

  user.two_factor_auth = true;
  user.save();
  res.status(200).json({ message: "2fa enabled successfully " });
};

const send2faCode = async (req, res) => {
  const { error } = enable2faSchema.validate(req.body);
  const { email } = req.body;

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({
    where: { email: email },
  });

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  if (!user) return res.status(400).json({ message: "User not found" });

  user.refresh_token = verificationCode;
  // const mailOptions = {
  //   from: 'testemail@gmail.com', // Your email address
  //   to: email, // User's email address
  //   subject: '2FA Verification',
  //   text: `Your verification code is: ${verificationCode}`,
  // };

  // Sending the email
  // await transporter.sendMail(mailOptions);
  user.save();
  res.status(200).json({ message: "You have been sent a code" });
};

const verify2fa = async (req, res) => {
  const { error } = verify2faSchema.validate(req.body);

  const { email, token } = req.body;

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({
    where: { email: email },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.token !== token) {
    return res.status(400).json({ message: "Code is incorrect" });
  }

  user.token = "";
  user.is_verified = true;

  user.save();

  res.status(200).json({
    data: user,
    message: "Token verified successfully",
  });
};

const sendVerificationCode = async (req, res) => {
  const { email, user } = req.body;

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "Email Verification",
    text: `
Your verification code is: ${user.token}. Please enter this code to verify your email.

If you're testing this api endpoint, send a POST request to https://auth.akuya.tech/api/auth/2fa/verify-code with the following body:

<code>
{
  "email": "${email}",
  "token": "${user.token}"
}
</code>
`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({
    status: 200,
    success: true,
    message: "User created successfully. Verification code sent to email.",
    data: user,
  });
};

const confirmVerificationCode = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Validate email and verification code
    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required.",
      });
    }

    // Verifing the verification code against the stored code in your database
    const user = await User.findOne({
      where: { email, token: verificationCode },
    });

    if (!user || user.token !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or verification code.",
        data: null,
      });
    }

    // Mark the email as verified
    user.is_verified = true;
    user.token = null; // Optional, clear the verification code from the database or not
    //  There is supposed to be a field where we set the state to be true once token is validated

    await user.save();

    res.status(200).json({
      success: true,
      message: "Token verified",
    });
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  login,
  enable2fa,
  send2faCode,
  verify2fa,
  sendVerificationCode,
  confirmVerificationCode,
  createUser,
};
