var express = require("express");
var router = express.Router();
const passport = require("passport")
const auth = require("../controllers/userController")

module.exports = function(app) {
    router.post("/login", auth.login)
    app.use('/api/auth', router )
}