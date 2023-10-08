var express = require("express");
var router = express.Router();
const { login, sendVerificationCode, confirmVerificationCode, createUser, enable2fa, send2faCode, verify2fa} = require("../controllers/userController");
const passport = require("passport");

router.post("/send-verification", sendVerificationCode)
router.post("/confirm-verification", confirmVerificationCode)
router.post('/signup', createUser);
router.post('/2fa/enable', enable2fa);
router.post('/2fa/send-code', send2faCode);
router.post('/2fa/verify-code', verify2fa);

module.exports = function(app) {
    router.post("/login", login)
    app.use('/api/auth', router )
}

module.exports = router