const { check, validationResult } = require("express-validator");
const db = require("../models/index");
const User = db.user;

const regMiddleware = (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    check(username, "Username is required").notEmpty();
    check(email, "Email is required")
      .isEmail()
      .notEmpty()
      .withMessage("invalid email address");
    check(password, "Password is required")
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 6 characters long") // checks if password is atleast must be at least 6 chars long
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character');

    email.custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("E-mail already in use");
      }
    });

    username.custom(async (value) => {
      const user = await User.findOne({ where: { username: value }});
      if (user) {
        throw new Error("Username already in use");
      }
    });

    passwordConfirmation.custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return value === req.body.password;
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
};

module.exports = regMiddleware;

