const { Router } = require('express');
const passport = require('passport');
const passwordRoute = require('./passwordRoute');

const AuthenticationController = require('../controllers/AuthenticationController');
const MessagingController = require('../controllers/MessagingController');
const registrationValidation = require('../middleware/registrationValidation');
const AuthenticationValidator = require('../validators/AuthenticationValidator');
const revalidateLogin = require('../controllers/AuthenticationController/revalidateLogin');
const loginResponse = require('../middleware/logginResponse');

const router = Router();

router.post('/check-email', AuthenticationController.checkEmail);

router.post(
  '/signup',
  registrationValidation,
  AuthenticationValidator.signup,
  AuthenticationController.createUser,
  MessagingController.sendSignUpEmail,
);

router.get('/verify/:token', AuthenticationController.verifyUser);

router.post(
  '/verify/resend',
  AuthenticationController.resendVerification,
  MessagingController.resendVerificationEmail,
);

router.use('/reset-password', passwordRoute);

router.post(
  '/login',
  AuthenticationValidator.login,
  AuthenticationController.login,
  AuthenticationController.loginResponse,
);

// Google Oauth routes
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
  AuthenticationController.loginResponse,
);

// Facebook Oauth routes
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] }),
);
router.get(
  '/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  AuthenticationController.loginResponse,
);

// GITHUB Oauth routes
router.get(
  '/github',
  passport.authenticate('github', { scope: ['profile', 'user:email'] }),
);
router.get(
  '/github/redirect',
  passport.authenticate('github', { session: false }),
  AuthenticationController.loginResponse,
);

// 2fa routes
router.post('/2fa/enable', AuthenticationController.enable2fa);
router.post('/2fa/send-code', AuthenticationController.send2faCode);
router.post('/2fa/verify-code', AuthenticationController.verify2fa);

router.get('/revalidate-login', revalidateLogin);
module.exports = router;
