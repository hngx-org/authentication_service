const Permission = require('../../models/Permissions');

const permissions = async (_req, res) => {
  const permissions = await Permission.findAll();

  const data = permissions.map((permission) => permission.name);

  res.status(200).json({
    status: 200,
    message: 'Permissions retrieved successfully',
    data,
  });
};

module.exports = permissions;
