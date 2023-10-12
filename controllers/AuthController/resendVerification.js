const User = require("../../models/Users");

const resendVerification = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "User not found",
    });
  }

  if (user.is_verified) {
    return res.status(400).json({
      status: 400,
      message: "User already verified",
    });
  }

  req.user = {
    id: user.id,
    firstName: user.first_name,
    email: user.email,
  };

  next();
};

module.exports = resendVerification;
