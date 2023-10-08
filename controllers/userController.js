const bcrypt = require("bcrypt");
const User = require("../models/Users");
const JwtStartegy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const transporter = require("../middleware/mailConfig")
const validator = require("validator");
const Joi = require("joi");

const enable2faSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verify2faSchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().email().required(),
});


async function createUser(req, res) {
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

  try {
    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      username: "",
      refresh_token: "",
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user.",
      error: error.message,
    });
  }
}





async function login(req, res) {
  const data = req.body;
  const user = await User.findOne(
    {
      where: { email: data.email }
    }
  );
  if (user) {
    const checkPassword = bcrypt.compareSync(data.password, user.password);
    if (!checkPassword) {
      return res.json("Incorrect passsword")
    } else {
      const jwt_payload = {

        id: user.id,
      }
      const token = jwt.sign(jwt_payload, process.env.jwtSecret);

      return res.json(
        {
          "token": token,
          "data": user,
          "statusCode": 200
        }
      )
    }
  } else {
    return res.json("User not found ")
  }
};




const enable2fa = async (req, res) => {
  const { error } = enable2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email } = req.body;
  const user = await User.findOne(
    {
      where: { email: email }
    }
  );
  if (!user) return res.status(400).json({ message: "User not found" });

  user.two_factor_auth = true;
  user.save();
  res.status(200).json({ message: '2fa enabled successfully '});
};



const send2faCode = async (req, res) => {
  const { error } = enable2faSchema.validate(req.body);
  const { email } = req.body;

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne(
    {
      where: { email: email }
    }
  );

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
  res.status(200).json({ message: 'You have been sent a code' });
};


const verify2fa = async (req, res) => {
  const { error } = verify2faSchema.validate(req.body);
  const { email, token} = req.body;
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne(
    {
      where: { email: email }
    }
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.refresh_token !== token) return res.status(400).json({ message: "Code is incorrect" });
  user.refresh_token = "";
  user.save();
  res.status(200).json({
    data: user,
    message: '2fa verified successfully'
  });
};


const sendVerificationCode = async (req, res) => {
  const { first_name, last_name, username, email, password, refresh_token } = req.body

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format.',
    });
  }

  // Generating a random 6 digit verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();


  await User.create({
    first_name,
    last_name,
    username,
    email,
    password,
    refresh_token,
    token: verificationCode, // There is meant to be a place Store the verification code in the database so it can be verified later
  })

  // Send an email with the verification code
  const mailOptions = {
    from: 'testemail@gmail.com', // Your email address
    to: email, // User's email address
    subject: 'Email Verification',
    text: `Your verification code is: ${verificationCode}`,
  };

  // Sending the email
  await transporter.sendMail(mailOptions);

  res.status(200).json({
    message: 'Verification code sent successfully',
  });
}

const confirmVerificationCode = async (req, res) => {
  try {
    const { email, verificationCode } = req.body

    // Validate email and verification code
    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required.',
      });
    }

    // Verifing the verification code against the stored code in your database
    const user = await User.findOne({
      where: { email, token: verificationCode },
    });

    if (!user || user.token !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or verification code.',
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
      message: 'Token verified',
    });
  } catch (error) {
    res.send(error.message)
  }
}


module.exports = {
  login,
  enable2fa,
  send2faCode,
  verify2fa,
  sendVerificationCode,
  confirmVerificationCode,
  createUser
}