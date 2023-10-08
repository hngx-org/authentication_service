const express = require("express")
const router = express.Router()
const { sendVerificationCode, confirmVerificationCode } = require("../controllers/authController")

router.post("/send-verification", sendVerificationCode)
router.post("confirm-verification", confirmVerificationCode)

module.exports = router