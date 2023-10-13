const { Router } = require('express');
const passwordRoute = require('./passwordRoute');

const AuthenticationController = require('../controllers/AuthenticationController');
const MessagingController = require('../controllers/MessagingController');
const registrationValidation = require('../middleware/registrationValidation');
const AuthenticationValidator = require('../validators/AuthenticationValidator');

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
);

// 2fa routes
router.post('/2fa/enable', AuthenticationController.enable2fa);
router.post('/2fa/send-code', AuthenticationController.send2faCode);
router.post('/2fa/verify-code', AuthenticationController.verify2fa);

module.exports = router;
