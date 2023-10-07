const express = require('express');
const { createUser } = require('../controllers/authController');
const router = express.Router();


router.post('/signup', createUser);

module.exports = router;
