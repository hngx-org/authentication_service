const { Router } = require('express');
const PasswordController = require('../controllers/PasswordController');
const MessagingController = require('../controllers/MessagingController');

const router = Router();

// => /auth/reset-password
router.post(
  '/',
  PasswordController.send,
  MessagingController.sendPasswordResetEmail,
);

// => /auth/reset-password
router.patch('/', PasswordController.reset);

module.exports = router;
