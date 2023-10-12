const express = require('express');
const router = express.Router();
const { setRole } = require('../controllers/rolesController');
const { errorHandler } = require('../middleware/ErrorMiddleware');
const User = require('../models/Users');
const Permission = require('../models/Permissions');
const {
  addPermission,
  removePermission,
} = require('../controllers/userPermissionController');
const { setRoleValidator } = require('../middleware/setRolesValidator');
const { verifyJwt, checkRole } = require('../middleware/roleAccess');

router.use(errorHandler);

router.put('/:id/role',verifyJwt, checkRole([3]),  setRoleValidator, setRole);

// Endpoint to add a permission to a user


router.post('/permission',verifyJwt, checkRole([3]), addPermission);


// Endpoint to remove a permission from a user
router.delete('/permission', verifyJwt, checkRole([3]),  removePermission);

module.exports = router;
