const express = require('express');
const router = express.Router();
const { setRole } = require('../controllers/rolesController');
const { errorHandler } = require('../middleware/ErrorMiddleware');

router.use(errorHandler);

router.put('/role', setRole);

module.exports = router;
