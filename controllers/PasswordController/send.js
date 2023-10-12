const User = require("../../models/Users");

const send = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  req.user = {
    id: user.id,
    firstName: user.firstName,
    email: user.email,
  };

  next();
};

module.exports = send;
