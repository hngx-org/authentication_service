const Role = require("../../models/Roles");

const roles = async (_req, res) => {
  const roles = await Role.findAll();

  res.status(200).json({
    status: 200,
    message: "Roles retrieved successfully",
    data: roles,
  });
};

module.exports = roles;

