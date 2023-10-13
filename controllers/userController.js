const bcrypt = require("bcrypt");
const User = require("../models/Users");
const JwtStartegy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const transporter = require("../middleware/mailConfig");
const validator = require("validator");
const Joi = require("joi");
const { sendVerificationEmail } = require("../helpers/sendVerificationEmail");
// error handler middleware:

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
  INVALID_INPUT_PARAMETERS,
  USER_NOT_VERIFIED,
} = require("../errors/httpErrorCodes");

const enable2faSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verify2faSchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().email().required(),
});

const changeEmailSchema = Joi.object({
  newEmail: Joi.string().email().required(),
})

async function createUser(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new BadRequest("Invalid email format.", INVALID_INPUT_PARAMETERS);
      // return res.status(400).json({
      //   success: false,
      //   message: "Invalid email format.",
      // });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequest("Email already exists.", EXISTING_USER_EMAIL);
      // return res.status(400).json({
      //   success: false,
      //   message: "Email already exists.",
      // });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      username: "",
      refresh_token: "",
      password: hashedPassword,
    });

    // Encrypt user id in JWT and send
    const jwt_payload = {
      id: newUser.id,
    };
    const verificationToken = jwt.sign(jwt_payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send verification link email to user
    await sendVerificationEmail(firstName, email, verificationToken);

    res.status(200).json({
      status: 200,
      success: true,
      message: "User created successfully. Verification code sent to email.",
      data: newUser.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = req.body;

    const user = await User.findOne({
      where: { email: data.email },
    });

    if (user) {
      // Check if user has verified their Email
      if (!user.is_verified) {
        throw new Forbidden("Please verify your email.", USER_NOT_VERIFIED);
        // return res.status(400).json({
        //   success: false,
        //   message: "Please verify your email.",
        // });
      }

      const checkPassword = bcrypt.compareSync(data.password, user.password);

      if (!checkPassword) {
        throw new Forbidden("Incorrect password.", ACCESS_DENIED);
        // return res.json("Incorrect passsword");
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
      throw new ResourceNotFound("User not found.", RESOURCE_NOT_FOUND);
      // return res.json("User not found ");
    }
  } catch (error) {
    next(error);
    // res.status(500).json({
    //   success: false,
    //   message: "Error logging in",
    //   error: error.message,
    // });
  }
}

async function checkEmail(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });

    if (user) {
      if (user.is_verified) {
        return res.status(200).json({
          success: true,
          isRegistered: true,
          isVerified: true,
        });
      } else {
        return res.status(200).json({
          success: true,
          isRegistered: true,
          isVerified: false,
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        isRegistered: false,
        isVerified: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking email",
      error: error.message,
    });
  }
}

const enable2fa = async (req, res, next) => {
  try {
    const { error } = enable2faSchema.validate(req.body);

    if (error) {
      throw new BadRequest(error.details[0].message, INVALID_INPUT_PARAMETERS);
      // return res.status(400).json({ message: error.details[0].message });
    }
    const { email } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new ResourceNotFound("User not found", RESOURCE_NOT_FOUND);
      // return res.status(400).json({ message: "User not found" });
    }

    user.two_factor_auth = true;
    user.save();
    res.status(200).json({ message: "2fa enabled successfully " });
  } catch (error) {
    next(error);
  }
};

const send2faCode = async (req, res, next) => {
  try {
    const { error } = enable2faSchema.validate(req.body);
    const { email } = req.body;

    if (error) {
      throw new BadRequest(error.details[0].message, INVALID_INPUT_PARAMETERS);
      // return res.status(400).json({ message: error.details[0].message });
    }
    const user = await User.findOne({
      where: { email: email },
    });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (!user) {
      throw new ResourceNotFound("User not found", RESOURCE_NOT_FOUND);
      // return res.status(400).json({ message: "User not found" });
    }

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
  } catch (error) {
    next(error);
  }
};

const verify2fa = async (req, res, next) => {
  try {
    const { error } = verify2faSchema.validate(req.body);

    const { email, token } = req.body;

    if (error) {
      throw new BadRequest(error.details[0].message, INVALID_INPUT_PARAMETERS);
      // return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new ResourceNotFound("User not found", RESOURCE_NOT_FOUND);
      // return res.status(400).json({ message: "User not found" });
    }

    if (user.token !== token) {
      throw new Unauthorized("Code is incorrect", INVALID_TOKEN);
      // return res.status(400).json({ message: "Code is incorrect" });
    }

    user.token = "";
    user.is_verified = true;

    user.save();

    res.status(200).json({
      data: user,
      message: "Token verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const sendVerificationCode = async (req, res, next) => {
  try {
    // const { first_name, last_name, username, email, password, refresh_token } =
    //   req.body;

    const { email } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      throw new BadRequest("Invalid email format.", INVALID_INPUT_PARAMETERS);
      // return res.status(400).json({
      //   success: false,
      //   message: "Invalid email format.",
      // });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (user) {
      // Check if user has already verified their Email
      if (user.is_verified) {
        // 404 Error or custom error handling
        throw new BadRequest(
          "Email already verified. please login",
          EMAIL_ALREADY_VERIFIED
        );
      }

      if (!checkPassword) {
        throw new Forbidden("Incorrect password.", ACCESS_DENIED);
        // return res.json("Incorrect passsword");
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
      throw new ResourceNotFound("User not found.", RESOURCE_NOT_FOUND);
      // return res.json("User not found ");
    }
    // Generating a random 6 digit verification code
    // const verificationCode = Math.floor(
    //   100000 + Math.random() * 900000
    // ).toString();

    // await User.create({
    //   first_name,
    //   last_name,
    //   username,
    //   email,
    //   password,
    //   refresh_token,
    //   token: verificationCode, // There is meant to be a place Store the verification code in the database so it can be verified later
    // });

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Verification code has been resent to email.",
      data: {
        ...user,
        token: undefined,
        password: undefined,
        refresh_token: undefined,
        two_factor_auth: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

const confirmVerificationCode = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      throw new BadRequest(
        "Email and verification code are required",
        MISSING_REQUIRED_FIELD
      );
      // return res.status(400).json({
      //   success: false,
      //   message: "Email and verification code are required.",
      // });
    }

    const user = await User.findOne({
      where: { email, token: verificationCode },
    });

    if (!user || user.token !== verificationCode) {
      throw new Forbidden("Invalid email or verification code", INVALID_TOKEN);
      // return res.status(400).json({
      //   success: false,
      //   message: "Invalid email or verification code.",
      //   data: null,
      // });
    }

    user.is_verified = true;
    user.token = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Token verified",
    });
  } catch (error) {
    next(error);
    // res.send(error.message);
  }
};

const changeEmail = async (req, res, next) => {
  try {
    const { error } = changeEmailSchema.validate(req.body);

    if (error) {
      throw new BadRequest(error.details[0].message, INVALID_INPUT_PARAMETERS);
    }

    const { newEmail } = req.body;
    const user = await User.findOne({
      where: { id: req.user.id }, // Use user authentication middleware to get the user's ID
    });

    if (!user) {
      throw new ResourceNotFound("User not found", RESOURCE_NOT_FOUND);
    }

    // Generate a JWT verification token for the user
    const jwt_payload = {
      id: user.id,
      email: newEmail, // Add the new email to the payload for reference
      action: 'change_email',
    };
    const newVerificationToken = jwt.sign(jwt_payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Update the user's email, token, and verification status
    user.email = newEmail;
    user.token = newVerificationToken;
    user.is_verified = false; // Mark the user as not verified

    await user.save();

    // Trigger the existing "sendVerificationCode" endpoint with the new email and verification code
    req.body = {
      email: newEmail,
      verificationCode: newVerificationToken,
      user: user, // Pass the user object to the existing function
    };

    // Send the verification code to the new email address
    await sendVerificationCode(req, res, next);

    // Return the new JWT verification token
    res.status(200).json({
      success: true,
      message: "Email change request successful. JWT verification token sent to the user.",
      verificationToken: newVerificationToken,
    });
  } catch (error) {
    // Handle errors and return appropriate responses
    if (error instanceof BadRequest) {
      return res.status(400).json({
        success: false,
        message: error.message,
        errorCode: error.code,
      });
    } else if (error instanceof ResourceNotFound) {
      return res.status(404).json({
        success: false,
        message: error.message,
        errorCode: error.code,
      });
    } else {
      // Handle other unexpected errors
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your request.",
        errorCode: SERVER_ERROR,
      });
    }
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
  checkEmail,
  changeEmail,
};
