const express = require('express');
const {  forgotPassword, resetPassword, verifyEmail } = require('../controllers/authController');
const { errorHandler } = require('../middleware/ErrorMiddleware');
const {githubLogin} = require("../controllers/githubLoginController")

const router = express.Router();


// router.post('/verify-email/:token', verifyEmail);
// router.post('/reset-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);

router.use(errorHandler);

module.exports = router;

