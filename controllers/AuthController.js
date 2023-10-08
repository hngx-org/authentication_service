const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require("../models/User");

const secretKey = 'your-secret-key'; // Replace with your own secret key

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const enable2faSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
});

const forgotPassword = (req, res) => {
  const { error } = forgotPasswordSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email } = req.body;
  // ... Implement forgot password functionality here
  res.status(200).json({ message: 'Reset password link sent successfully.' });
};

const resetPassword = (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { token, password } = req.body;
  // ... Implement reset password functionality here
  res.status(200).json({ message: 'Password reset successfully.' });
};


const enable2fa = (req, res) => {
  const { error } = enable2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  

 const user = await User.findOne( 
       { where: { email: data.email } 
       } 
  );

if(!user) return res.status(400).json({ message: "User not found" });
 

user.two_factor_enabled = true;
user.save();
  res.status(200).json({ message: '2fa enabled successfully ' });
};



const send2faCode = (req, res) => {
  const { error } = enable2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  

 const user = await User.findOne( 
       { where: { email: data.email } 
       } 
  );

if(!user) return res.status(400).json({ message: "User not found" });
 

// The middleware for sending code is not ready




  res.status(200).json({ message: 'You have been sent a code ' });
};


const verify2fa = (req, res) => {
  const { error } = verify2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  

 const user = await User.findOne( 
       { where: { email: data.email } 
       } 
  );

if(!user) return res.status(400).json({ message: "User not found" });
 
const { token } = req.body;
user.two_factor_enabled = true;
user.save();
  res.status(200).json({ message: '2fa enabled successfully ' });
};

module.exports = { forgotPassword, resetPassword, enable2fa , send2faCode, verify2fa};
