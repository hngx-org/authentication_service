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



const verify2faSchema = Joi.object({
  token: Joi.string().required(),
});
const send2faSchema = Joi.object({
  email: Joi.string().email().required(),
});

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

const enable2fa = async (req, res, next) => {
  try {
    const { error } = send2faSchema.validate(req.body);

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
    const { error } = send2faSchema.validate(req.body);
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
    }

    const jwt_payload = {
      id: user.id,
      code: verificationCode
    };
    const verificationToken = jwt.sign(jwt_payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send verification link email to user
    await sendVerificationEmail(user.first_name, email, verificationToken);
    res.status(200).json({ message: "You have been sent a code", token: verificationToken });
  } catch (error) {
    next(error);
  }
};

const verify2fa = async (req, res, next) => {
  const { error } = verify2faSchema.validate(req.body);
  const { token } = req.body;


  try {
    if (error) {
      throw new BadRequest(error.details[0].message, 400);
    }
    const bearer = req.headers['authorization'];
    if (!bearer) throw new BadRequest("INVALID TOKEN", 400);

    const bearerToken = bearer.split(' ')[1];
    const payload = jwt.decode(bearerToken);
    console.log(payload);
    if (!payload) throw new BadRequest("INVALID TOKEN HEADER", 403);

    const user = await User.findOne({
      where: { id: payload.id },
    });

    if (token === payload.code) {
      res.status(200).json({
        data: user,
        message: "Token verified successfully",
      });
    } else {
      throw new BadRequest("INVALID TOKEN", 400);
    }


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

module.exports = {
  login,
  enable2fa,
  send2faCode,
  verify2fa,
  sendVerificationCode,
  confirmVerificationCode,
  createUser,
};
