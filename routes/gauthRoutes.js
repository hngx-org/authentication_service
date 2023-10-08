const { Router } = require("express");
const passport = require("passport");
const { handleAuth } = require("../controllers/gauthControllers");
require("../services/passportService");

const gauthRoutes = Router();

gauthRoutes.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

gauthRoutes.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    session: false,
  }),
  handleAuth
);

module.exports = { gauthRoutes };
