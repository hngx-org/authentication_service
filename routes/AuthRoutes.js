const express = require('express');
const { forgotPassword, resetPassword } = require('../controllers/AuthController');
const { errorHandler } = require('../middlewares/ErrorMiddleware');
const {githubLogin} = require("../controllers/githubLoginController")
const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post("/github", githubLogin)

router.use(errorHandler);

module.exports = router;
