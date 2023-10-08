const express = require('express');
const {  forgotPassword, resetPassword, verifyEmail } = require('../controllers/authController');
const { errorHandler } = require('../middleware/ErrorMiddleware');
const {githubLogin} = require("../controllers/githubLoginController")

const router = express.Router();

router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post("/github", githubLogin)

router.use(errorHandler);

module.exports = router;
