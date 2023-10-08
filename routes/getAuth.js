const express = require('express');
const { getAuth, getAuthPermissions } = require('../controllers/getAuth');
const router = express.Router();

router.post('/', getAuth);
router.post('/all-permissions', getAuthPermissions);

module.exports = router;
