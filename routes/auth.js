const express = require('express');
const {
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require('../controllers/authController');
const {
  login,
  sendVerificationCode,
  confirmVerificationCode,
  createUser,
  enable2fa,
  send2faCode,
  verify2fa,
} = require('../controllers/userController');
const passport = require('passport');
const { handleAuth } = require('../controllers/gauthControllers');
require('../services/passportService');
const { errorHandler } = require('../middleware/ErrorMiddleware');

const router = express.Router();
router.use(errorHandler);

// PASSWORD RESET AND EMAIL VERIFICATION
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// GOOGLE OAUTH
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);
router.get(
  '/google/redirect',
  passport.authenticate('google', {
    session: false,
  }),
  handleAuth
);

// EMAIL AND 2FA
router.post('/send-verification', sendVerificationCode);
router.post('/confirm-verification', confirmVerificationCode);
router.post('/signup', createUser);
router.post('/2fa/enable', enable2fa);
router.post('/2fa/send-code', send2faCode);
router.post('/2fa/verify-code', verify2fa);


// EMAIL LOGIN
router.post('/login', login);


module.exports = router;
