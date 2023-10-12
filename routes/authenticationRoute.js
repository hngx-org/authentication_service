const { Router } = require("express");
const passwordRoute = require("./passwordRoute");

const AuthenticationController = require("../controllers/AuthenticationController");
const MessagingController = require("../controllers/MessagingController");
const registrationValidation = require("../middleware/registrationValidation");
const AuthenticationValidator = require("../validators/AuthenticationValidator");

const router = Router();

router.post("/check-email", AuthenticationController.checkEmail);

router.post(
  "/signup",
  registrationValidation,
  AuthenticationValidator.signup,
  AuthenticationController.createUser,
  MessagingController.sendSignUpEmail,
);

router.get("/verify/:token", AuthenticationController.verifyUser);

router.post(
  "/verify/resend",
  AuthenticationController.resendVerification,
  MessagingController.resendVerificationEmail,
);

router.use("/reset-password", passwordRoute);

router.post("/login", AuthenticationValidator.login, AuthenticationController.login);

module.exports = router;
