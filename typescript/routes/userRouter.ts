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

userRouter.patch('/set-seller', setIsSeller);

export default userRouter;
