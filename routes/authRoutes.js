const express = require('express');
const {  forgotPassword, resetPassword, verifyEmail } = require('../controllers/authController');
const { errorHandler } = require('../middleware/ErrorMiddleware');

const router = express.Router();

router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.use(errorHandler);

module.exports = router;
