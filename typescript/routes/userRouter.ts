import express from 'express';
import {changeEmail, changeEmailLink, changePassword, checkEmail, createUser, enable2fa, forgotPassword, loginUser, resendVerification, restPassword, revalidateLogin, verifyUser} from "../controllers/UserController";

const userRouter = express.Router();

userRouter.post('/signup', createUser);
userRouter.post('/login', loginUser);
userRouter.post('/verify/:token', verifyUser);
userRouter.post('/verify/resend', resendVerification);
userRouter.post('/check-email', checkEmail);
userRouter.post('change-email', changeEmailLink);
userRouter.patch('change-email/:token', changeEmail);
userRouter.put('change-password', changePassword);
userRouter.post('forgot-password', forgotPassword);
userRouter.post('reset-password/:token', restPassword);
userRouter.get('/revalidate-login/:token', revalidateLogin);
userRouter.post('/2fa/enable', enable2fa);
// userRouter.post('/2fa/send-code', AuthenticationController.send2faCode);
// userRouter.post('/2fa/verify-code', AuthenticationController.verify2fa);


export default userRouter;
