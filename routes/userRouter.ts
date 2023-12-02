import {
  deleteUserById,
  fetchAllUser,
  findUserById,
  guestSignup,
  send2fa,
  updateUserById,
  verify2faCode,
  updateRole,
} from './../controllers/UserController/index';
import { protectedRoute } from './../middlewares/auth';
import express from 'express';
import {
  changeEmail,
  loginResponse,
  changePassword,
  checkEmail,
  signUp,
  enable2fa,
  disable2fa,
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
import '../services/Passport/PassportServiceFacebook';
import '../services/Passport/PassportServiceGithub';
import '../services/Passport/PassportServiceGoogle';
// import { handleAuth } from '../controllers/AuthController/oauthControllers';

//Non protected User Auth routes
userRouter.post('/check-email', checkEmail); // working
userRouter.patch('/change-email', changeEmail);
userRouter.post('/signup', signUp); // working
userRouter.post('/signup-guest', guestSignup); // working
userRouter.get('/verify/:token', verifyUser, loginResponse); // working
userRouter.post('/verify/resend', resendVerification); // working
userRouter.post('/login', loginUser, send2fa, loginResponse); // working
userRouter.get('/revalidate-login/:token', revalidateLogin, loginResponse); // working

// Password reset routes
userRouter.post('/reset-password', forgotPassword);
userRouter.put('/reset-password/change', changePassword);
userRouter.patch('/reset-password/', resetPassword);

// 2FA routes
userRouter.post('/2fa/disable', disable2fa);
userRouter.post('/2fa/enable', enable2fa);
userRouter.post('/2fa/send-code', send2faCode);
userRouter.post('/2fa/verify-code', verify2faCode, loginResponse);

// Protected User routes
userRouter.get('/users', fetchAllUser);
userRouter.get('/users/:userId', findUserById);
userRouter.delete('/users/:userId', deleteUserById);
userRouter.put('/users/update/', protectedRoute, updateUserById);
userRouter.put('/:userId/role', protectedRoute, updateRole);

// oauth routes

// Google Oauth routes
userRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);
userRouter.get(
  '/google/redirect',
  passport.authenticate('google', {
    session: false,
  }),
  send2fa,
  loginResponse
);

// Facebook Oauth routes
userRouter.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
);
userRouter.get(
  '/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  send2fa,
  loginResponse
);

// GITHUB Oauth routes
userRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['profile', 'user:email'] })
);
userRouter.get(
  '/github/redirect',
  passport.authenticate('github', { session: false }),
  send2fa,
  loginResponse
);
userRouter.patch('/set-seller', setIsSeller);

export default userRouter;
