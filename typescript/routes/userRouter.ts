import express from 'express';
import {changeEmail, changeEmailLink, changePassword, checkEmail, createUser, loginUser, resendVerification, verifyUser} from "../controllers/UserController";

const userRouter = express.Router();

userRouter.post('/signup', createUser);
userRouter.post('/login', loginUser);
userRouter.post('/verify/:token', verifyUser);
userRouter.post('/verify/resend', resendVerification);
userRouter.post('/check-email', checkEmail);
userRouter.post('change-email', changeEmailLink);
userRouter.patch('change-email/:token', changeEmail);
userRouter.put('change-password', changePassword);

export default userRouter;
