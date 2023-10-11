const express = require('express');
const router = express.Router();
const { setRole } = require('../controllers/rolesController');
const { errorHandler } = require('../middleware/ErrorMiddleware');
const User = require('../models/Users');
const Permission = require('../models/Permissions');
const { addPermission, removePermission } = require('../controllers/userPermissionController');

router.use(errorHandler);

router.put('/role', setRole);


// Endpoint to add a permission to a user
router.post('/addPermission',addPermission);

// Endpoint to remove a permission from a user
router.delete('/removePermission', removePermission);



module.exports = router;
