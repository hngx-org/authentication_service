const { Router } = require("express");
const PasswordController = require("../controllers/PasswordController");
const MessagingController = require("../controllers/MessagingController");

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Password route",
  });
});

router.post(
  "/",
  PasswordController.send,
  MessagingController.sendPasswordResetEmail,
);

module.exports = router;
