const express = require('express');
const {  forgotPassword, resetPassword, verifyEmail } = require('../controllers/authController');
const { errorHandler } = require('../middleware/ErrorMiddleware');
const {githubLogin} = require("../controllers/githubLoginController");
const { verifyJwt, checkRole } = require('../middleware/roleAccess');

const router = express.Router();

router.post('/verify-email',verifyJwt, checkRole([2,3]),  verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post("/github", githubLogin)

router.use(errorHandler);

module.exports = router;

