const User = require("../../models/Users");

/**
 * @description check if email is already in use
 */
const checkEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findAll({
    where: {
      email,
    },
  });

  if (user.length > 0) {
    return res.status(409).json({
      status: 409,
      message: "Email already in use",
    });
  }

  return res.status(200).json({
    status: 200,
    message: "Email is available for use",
  });
};

module.exports = checkEmail;
