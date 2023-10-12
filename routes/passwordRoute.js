const { Router } = require("express");
const PasswordController = require("../controllers/PasswordController");
const MessagingController = require("../controllers/MessagingController");

const router = Router();

router.post(
  "/password",
  PasswordController.send,
  MessagingController.sendPasswordResetEmail,
);

module.exports = router;
