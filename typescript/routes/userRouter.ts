import {
  deleteUserById,
  fetchAllUser,
  findUserById,
  updateUserById,
  verify2faCode,
} from './../controllers/UserController/index';
import { protectedRoute } from './../middlewares/auth';
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

export default userRouter;
