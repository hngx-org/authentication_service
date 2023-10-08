const express = require('express');
const { getAuth, getAuthPermissions } = require('../controllers/getAuth');
const router = express();

router.get('/', getAuth);
router.get('/all-permissions', getAuthPermissions);

module.exports = router;
