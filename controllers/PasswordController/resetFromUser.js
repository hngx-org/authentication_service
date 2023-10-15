/*eslint-disable*/
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/Users');

/**
 * @description recieves a token and a new password from the user, verifies the token and updates the user's Password
 * @param {object} req - request object
 * @param {object} res - response object
 */
const resetByUser = (req, res) => {
  const { token, password } = req.body;
  const { JWT_SECRET } = process.env;

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid token',
      });
    }

    const { id } = decoded;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'User not found',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({ password: hashedPassword });

    return res.status(200).json({
      status: 200,
      message: 'Password reset successful',
    });
  });
};

module.exports = resetByUser;
