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
  changeEmail,
  changeVerificationEmail,
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
} from '../controllers/UserController';

const userRouter = express.Router();
import passport from 'passport';
import '../services/Passport/PassportServiceFacebook'
import '../services/Passport/PassportServiceGithub'
import '../services/Passport/PassportServiceGoogle'
import {handleAuth} from "../controllers/AuthController/oauthControllers";

//Non protected User Auth routes
userRouter.post('/check-email', checkEmail);
userRouter.post('/signup', signUp);
userRouter.get('/verify/:token', verifyUser);
userRouter.post('/verify/resend', resendVerification);
userRouter.post('/login', loginUser);
userRouter.get('/revalidate-login/:token', revalidateLogin);

userRouter.post('/change-email', changeVerificationEmail);
userRouter.patch('/change-email/:token', changeEmail);

// Password reset routes
userRouter.put('/change-password', protectedRoute, changePassword);
userRouter.post('/forgot-password', forgotPassword);
userRouter.put('/reset-password/:token', resetPassword);

// 2FA routes
userRouter.post('/2fa/enable', protectedRoute, enable2fa);
userRouter.post('/2fa/send-code', protectedRoute, send2faCode);
userRouter.post('/2fa/verify-code', verify2faCode);
userRouter.post('/2fa/disable', protectedRoute, enable2fa);

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

export default userRouter;
