const User = require("../../models/Users");

const signup = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user) {
    return res.status(409).json({
      status: 409,
      message: "User with that email already exists",
    });
  }

  next();
};

module.exports = signup;
