const jwt = require('jsonwebtoken');
const User = require('../../models/Users');

const revalidateLogin = async (req, res, next) => {
  const { token } = req.params;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        status: 401,
        message: 'Invalid token',
      });
    }

    const { id } = decoded;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ status: 401, message: 'User not found' });
    }
    req.user = user;
    next();
  });
};
module.exports = revalidateLogin;
