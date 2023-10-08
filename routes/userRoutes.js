var express = require("express");
var router = express.Router();
const passport = require("passport")
const { login, sendVerificationCode, confirmVerificationCode} = require("../controllers/userController")

router.post("/send-verification", sendVerificationCode)
router.post("/confirm-verification", confirmVerificationCode)
module.exports = function(app) {
    router.post("/login", login)
    app.use('/api/auth', router )
}

module.exports = router