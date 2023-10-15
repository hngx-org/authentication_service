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

router.post(
  '/change',
  PasswordController.change,
);

// => /auth/reset-password
router.patch('/', PasswordController.reset);

module.exports = router;
