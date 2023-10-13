const { Router } = require('express');
const PasswordController = require('../controllers/PasswordController');
const MessagingController = require('../controllers/MessagingController');

const router = Router();

router.get('/:token', PasswordController.verifyPasswwordResetToken);

router.post(
  '/',
  PasswordController.send,
  MessagingController.sendPasswordResetEmail,
);

router.patch('/', PasswordController.reset);

module.exports = router;
