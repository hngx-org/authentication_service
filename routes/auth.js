const express = require('express');
const passport = require('passport');
const {
  enable2fa,
  send2faCode,
  verify2fa,
  changeEmail,
} = require('../controllers/userController');
require('../services/passportService');
const { errorHandler } = require('../middleware/ErrorMiddleware');
const registrationValidation = require('../middleware/registrationValidation');
require('../services/passportServiceFb');
const authEmail = require('../middleware/authEmail');
const revalidateLogin = require('../controllers/AuthenticationController/revalidateLogin');
const loginResponse = require('../middleware/logginResponse');

const router = express.Router();
router.use(errorHandler);

// GOOGLE OAUTH
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    session: false,
  }),
  loginResponse,
);

// FACEBOOK AUTH
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] }),
);
router.get(
  '/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  loginResponse,
);

// GITHUB OAUTH
router.get(
  '/github',
  passport.authenticate('github', { scope: ['profile', 'user:email'] }),
);
router.get(
  '/github/redirect',
  passport.authenticate('github', { session: false }),
  loginResponse,
);
router.get('/revalidate-login', revalidateLogin);
// CHANGE EMAIL
router.patch('/change-email', authEmail, changeEmail);

module.exports = router;
