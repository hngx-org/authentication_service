const User = require("../../models/Users");
const Role = require("../../models/Role"); 
const bcrypt = require("bcrypt");

const createUser = async (req, res, next) => {
  const { firstName, lastName, email, password, roleName } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    let roleId; // Initialize roleId variable

    if (roleName) {
      // If a role name is provided, find the role by name
      const role = await Role.findOne({ where: { name: roleName } });

      if (role) {
        roleId = role.id;
      } else {
        // If the role doesn't exist, create a new role with the provided name
        const newRole = await Role.create({ name: roleName });
        roleId = newRole.id;
      }
    }

    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      username: "",
      token: "",
      refresh_token: "",
      role_id: roleId || 2, // Use the specified roleId or default to 2
    });

    req.user = {
      id: newUser.id,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: newUser.email,
      role_id: newUser.role_id,
    };
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error creating user",
      error: error,
    });
  }

  next();
};

module.exports = createUser;
