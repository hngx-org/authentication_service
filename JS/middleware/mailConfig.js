// emailConfig.js
// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

// Create a transporter object for sending email
const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER, // Your email address
    pass: process.env.NODEMAILER_PASSWORD, // Your email password or app-specific password
  },
});

module.exports = transporter;
