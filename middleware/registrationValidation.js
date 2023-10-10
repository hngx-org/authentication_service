const { check, validationResult } = require("express-validator");
const db = require("../models/Users");
const User = db.user;

const registrationValidation = (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    check(firstName)
      .notEmpty()
      .withMessage("First name is required")
      .isString()
      .withMessage("First name must be a string");

    check(lastName)
      .notEmpty()
      .withMessage("Last name is required")
      .isString()
      .withMessage("Last name must be a string");

    check(email)
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid");

    check(password)
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain a special character");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = registrationValidation;
