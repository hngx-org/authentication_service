const express = require("express");
const {
  getAuthPermissions,
  sendPermissionsAndRows,
} = require("../controllers/authorize");
const AuthorizationController = require("../controllers/AuthorizationController");
const AuthorizationValidator = require("../validators/AuthorizationValidator/index");

const router = express.Router();

router.post(
  "/",
  AuthorizationValidator.authorize,
  AuthorizationController.authorize,
);

router.post("/permissions", getAuthPermissions);
router.post("/roles", getAuthPermissions);
router.get("/roles-and-permissions", sendPermissionsAndRows);

module.exports = router;
