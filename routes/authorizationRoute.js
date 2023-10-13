const express = require("express");
const AuthorizationController = require("../controllers/AuthorizationController");
const AuthorizationValidator = require("../validators/AuthorizationValidator/index");

const router = express.Router();

router.post(
  "/",
  AuthorizationValidator.authorize,
  AuthorizationController.authorize,
);

router.get("/permissions", AuthorizationController.permissions);
router.get("/roles", AuthorizationController.roles);

module.exports = router;
