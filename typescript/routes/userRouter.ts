import {
  deleteUserById,
  fetchAllUser,
  findUserById,
  updateUserById,
  verify2faCode,
} from './../controllers/UserController/index';
import {protectedRoute} from './../middlewares/auth';
import express from 'express';
import {
  // changeEmail,
  // changeVerificationEmail,
  loginResponse,
  changePassword,
  checkEmail,
  signUp,
  enable2fa,
  forgotPassword,
  loginUser,
  resendVerification,
  resetPassword,
  revalidateLogin,
  send2faCode,
  verifyUser,
  setIsSeller,
} from '../controllers/UserController';

const userRouter = express.Router();
import passport from 'passport';
import '../services/Passport/PassportServiceFacebook'
import '../services/Passport/PassportServiceGithub'
import '../services/Passport/PassportServiceGoogle'
import {handleAuth} from "../controllers/AuthController/oauthControllers";

//Non protected User Auth routes
userRouter.post('/check-email', checkEmail); // working
userRouter.post('/signup', signUp); // working
userRouter.get('/verify/:token', verifyUser, loginResponse); // working
userRouter.post('/verify/resend', resendVerification); // working
userRouter.post('/login', loginUser, loginResponse); // working
userRouter.get('/revalidate-login/:token', revalidateLogin, loginResponse); // working

// userRouter.post('/change-email', changeVerificationEmail);
// userRouter.patch('/change-email/:token', changeEmail);

// Password reset routes
userRouter.put('/change-password', protectedRoute, changePassword);
userRouter.post('/forgot-password', forgotPassword);
userRouter.put('/reset-password/:token', resetPassword);

// 2FA routes
userRouter.post('/2fa/enable', protectedRoute, enable2fa);
userRouter.post('/2fa/send-code', protectedRoute, send2faCode);
userRouter.post('/2fa/disable', protectedRoute, enable2fa);
userRouter.post('/2fa/verify-code', verify2faCode, loginResponse);

// Protected User routes
userRouter.get('/users', fetchAllUser);
userRouter.get('/users/:userId', findUserById);
userRouter.delete('/users/:userId', deleteUserById);
userRouter.put('/users/update/', protectedRoute, updateUserById);

// oauth routes


// Google Oauth routes
userRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);
userRouter.get(
  '/google/redirect',
  passport.authenticate('google', {
    session: false,
  }),
  handleAuth,
);

// Facebook Oauth routes
userRouter.get(
  '/facebook',
  passport.authenticate('facebook', {scope: ['email', 'public_profile']}),
);
userRouter.get(
  '/facebook/redirect',
  passport.authenticate('facebook', {failureRedirect: '/login'}),
  handleAuth,
);

// GITHUB Oauth routes
userRouter.get(
  '/github',
  passport.authenticate('github', {scope: ['profile', 'user:email']}),
);
userRouter.get(
  '/github/redirect',
  passport.authenticate('github', {session: false}),
  handleAuth
  ,
);
userRouter.patch('/set-seller', setIsSeller);

export default userRouter;
