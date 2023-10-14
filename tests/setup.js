// // tests/setup.js
// const nodemailer = require('nodemailer');

// // Mock the mailer module
// jest.mock('../middleware/mailConfig', () => ({
//     sendMail: jest.fn(),
// }));

// // Mock the User model
// jest.mock('../models/User', () => ({
//     create: jest.fn(),
//     findOne: jest.fn(),
// }));

// // Create a mock transporter
// const transporter = nodemailer.createTransport({
//     sendMail: jest.fn(),
// });

// module.exports = {
//     transporter,
// };
