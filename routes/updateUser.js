const express = require('express');
const router = express.Router();
const { setRole } = require('../controllers/rolesController');
const { getAllUsers } = require('../controllers/adminControllers')
const { errorHandler } = require('../middleware/ErrorMiddleware');
const User = require('../models/Users');
const Permission = require('../models/Permissions');
const {
  addPermission,
  removePermission,
} = require('../controllers/userPermissionController');
const { setRoleValidator } = require('../middleware/setRolesValidator');

router.use(errorHandler);

router.put('/:id/role', setRoleValidator, setRole);

// Endpoint to add a permission to a user


router.post('/permission',addPermission);


// Endpoint to remove a permission from a user
router.delete('/permission', removePermission);

// Endpointfor admin to get all users
router.get('/', getAllUsers) 

module.exports = router;
