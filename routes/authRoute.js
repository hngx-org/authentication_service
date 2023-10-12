const { Router } = require("express");
const AuthController = require("../controllers/AuthController");

const router = Router();

router.post("/check-email", AuthController.checkEmail);

module.exports = router;
