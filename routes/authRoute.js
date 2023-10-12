const { Router } = require("express");
const passwordRoute = require("./passwordRoute");

const AuthController = require("../controllers/AuthController");
const MessagingController = require("../controllers/MessagingController");
const registrationValidation = require("../middleware/registrationValidation");
const AuthValidators = require("../validators/AuthValidators");

const router = Router();

router.post("/check-email", AuthController.checkEmail);

router.post(
  "/signup",
  registrationValidation,
  AuthValidators.signup,
  AuthController.createUser,
  MessagingController.sendSignUpEmail,
);

router.get("/verify/:token", AuthController.verifyUser);

router.post(
  "/verify/resend",
  AuthController.resendVerification,
  MessagingController.resendVerificationEmail,
);

router.use("/reset-password", passwordRoute);

module.exports = router;
