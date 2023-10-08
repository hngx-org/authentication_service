var express = require("express");
var router = express.Router();
const passport = require("passport")
const { login, sendVerificationCode, confirmVerificationCode, createUser} = require("../controllers/userController")

router.post("/send-verification", sendVerificationCode)
router.post("/confirm-verification", confirmVerificationCode)
router.post('/signup', createUser);

module.exports = function(app) {
    router.post("/login", login)
    app.use('/api/auth', router )
}

module.exports = router