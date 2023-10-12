const User = require("../../models/Users");
const jwt = require("jsonwebtoken");

const verifyPasswordResetToken = (req, res) => {
  const { token } = req.params;
  const { JWT_SECRET, PASSWORD_RESET_SUCCESS_URL } = process.env;

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Invalid token",
      });
    }

    const { email } = decoded;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "User not found",
      });
    }

    res.status(301).redirect(`${PASSWORD_RESET_SUCCESS_URL}/?token=${token}`);
  });
};

module.exports = verifyPasswordResetToken;
