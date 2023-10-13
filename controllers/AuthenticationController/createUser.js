const User = require("../../models/Users");
const bcrypt = require("bcrypt");
const Role = require("../../models/Roles");

const createUser = async (req, res, next) => {
  const { firstName, lastName, email, password, roleName } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    let roleId; // Initialize roleId variable

    if (roleName) {
      // If a role name is provided, create a new role
      const newRole = await Role.create({ name: roleName });
      roleId = newRole.id;
    }
    // else a user is created with default roleId
    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
      username: "",
      token: "",
      refresh_token: "",
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
