const express = require("express");
const {
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/authController");
const {
  login,
  sendVerificationCode,
  confirmVerificationCode,
  createUser,
  enable2fa,
  send2faCode,
  verify2fa,
} = require("../controllers/userController");
const passport = require("passport");
const { handleAuth } = require("../controllers/gauthControllers");
require("../services/passportService");
const { errorHandler } = require("../middleware/ErrorMiddleware");
const registrationValidation = require("../middleware/registrationValidation");
require("../services/passportServiceFb");
const { authFacebook } = require("../controllers/authFacebook");
const handleGithubAUth = require("../controllers/githubauthController");
const {
  githubLogin,
  githubRedirectUrl,
} = require("../controllers/githubLoginController");
const { verifyJwt, checkRole } = require('../middleware/roleAccess');

const router = express.Router();
router.use(errorHandler);

// PASSWORD RESET AND EMAIL VERIFICATION
router.get("/verify/:token", verifyJwt, checkRole([2,3]), verifyEmail);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);

// GOOGLE OAUTH
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    session: false,
  }),
  handleAuth
);

// FACEBOOK AUTH
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  authFacebook
);

// EMAIL REGISTRATION
router.post("/signup", registrationValidation, createUser);

router.post("/send-verification", verifyJwt, checkRole([2,3]),  sendVerificationCode);
router.post("/confirm-verification", verifyJwt, checkRole([2,3]),  confirmVerificationCode);
router.post("/2fa/enable", verifyJwt, checkRole([2,3]),  enable2fa);
router.post("/2fa/send-code", verifyJwt, checkRole([2,3]),  send2faCode);
router.post("/2fa/verify-code", verifyJwt, checkRole([2,3]),  verify2fa);

// EMAIL LOGIN
router.post("/login", login);

module.exports = router;
