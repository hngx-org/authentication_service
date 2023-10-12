const Role = require("../../models/Roles");

const roles = async (_req, res) => {
  const roles = await Role.findAll();

  const data = roles.map((role) => role.name);

  res.status(200).json({
    status: 200,
    message: "Roles retrieved successfully",
    data,
  });
};

module.exports = roles;
