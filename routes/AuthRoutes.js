const express = require('express');
const { forgotPassword, resetPassword } = require('../controllers/AuthController');
const { errorHandler } = require('../middleware/ErrorMiddleware');
const passport = require("passport");

const router = express.Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["profile", "user:email"] })
);
router.get(
  "/github/redirect",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (_req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.use(errorHandler);

module.exports = router;
 