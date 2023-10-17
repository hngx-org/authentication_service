import { protectedRoute } from './../middlewares/auth';
import express from 'express';
import {changeEmail, changeEmailLink, changePassword, checkEmail, signUp, enable2fa, forgotPassword, loginUser, resendVerification, restPassword, revalidateLogin, send2faCode, verifyUser} from "../controllers/UserController";
const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', loginUser);
userRouter.patch('/verify/:token', verifyUser);
userRouter.post('/verify/resend', resendVerification);
userRouter.post('/check-email', checkEmail);
userRouter.post('/change-email', changeEmailLink);
userRouter.patch('/change-email/:token', changeEmail);
userRouter.put('/change-password', protectedRoute, changePassword);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', restPassword);
userRouter.get('/revalidate-login/:token', revalidateLogin);
userRouter.post('/2fa/enable', enable2fa);
userRouter.post('/2fa/send-code', send2faCode);
// userRouter.post('/2fa/verify-code', AuthenticationController.verify2fa);


export default userRouter;
