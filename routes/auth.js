const express = require('express');
const passport = require('passport');
const {
  enable2fa,
  send2faCode,
  verify2fa,
  changeEmail,
} = require('../controllers/userController');
const { handleAuth } = require('../controllers/gauthControllers');
require('../services/passportService');
const { errorHandler } = require('../middleware/ErrorMiddleware');
const registrationValidation = require('../middleware/registrationValidation');
require('../services/passportServiceFb');
const { authFacebook } = require('../controllers/authFacebook');
const handleGithubAUth = require('../controllers/githubauthController');
const {
  githubLogin,
  githubRedirectUrl,
} = require('../controllers/githubLoginController');
const authEmail = require('../middleware/authEmail');
const revalidateLogin = require('../controllers/AuthenticationController/revalidateLogin');

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
  handleAuth,
);

// FACEBOOK AUTH
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] }),
);
router.get(
  '/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  authFacebook,
);

// GITHUB OAUTH
router.get(
  '/github',
  passport.authenticate('github', { scope: ['profile', 'user:email'] }),
);
router.get(
  '/github/redirect',
  passport.authenticate('github', { session: false }),
  handleGithubAUth,
);
router.get("/revalidate-login", revalidateLogin)
// CHANGE EMAIL
router.patch('/change-email', authEmail, changeEmail);

module.exports = router;
