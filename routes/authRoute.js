const { Router } = require("express");
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

router.post(
  "/verify/resend",
  AuthController.resendVerification,
  MessagingController.resendVerificationEmail,
);

router.get("/verify/:token", AuthController.verifyUser);

module.exports = router;
