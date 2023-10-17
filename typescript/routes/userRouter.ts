import {
  deleteUserById,
  fetchAllUser,
  findUserById,
  updateUserById,
  verify2faCode,
} from "./../controllers/UserController/index";
import { protectedRoute } from "./../middlewares/auth";
import express from "express";
import {
  changeEmail,
  changeEmailLink,
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
} from "../controllers/UserController";
const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", loginUser);
userRouter.patch("/verify/:token", verifyUser);
userRouter.post("/verify/resend", resendVerification);
userRouter.post("/check-email", checkEmail);
userRouter.post("/change-email", changeEmailLink);
userRouter.patch("/change-email/:token", changeEmail);
userRouter.put("/change-password", protectedRoute, changePassword);
userRouter.post("/forgot-password", forgotPassword);
userRouter.put("/reset-password/:token", resetPassword);
userRouter.get("/revalidate-login/:token", revalidateLogin);
userRouter.post("/2fa/enable", protectedRoute, enable2fa);
userRouter.post("/2fa/send-code", protectedRoute, send2faCode);
userRouter.post("/2fa/verify-code", verify2faCode);
userRouter.get("/users", fetchAllUser);
userRouter.get("/users/:userId", findUserById);
userRouter.delete("/users/:userId", deleteUserById);
userRouter.put("/users/update/", protectedRoute, updateUserById);

export default userRouter;
