const jwt = require('jsonwebtoken');
const User = require('../../models/Users');

const verifyUser = async (req, res) => {
  const { token } = req.params;
  const { JWT_SECRET, VERIFICATION_SUCCESS_URL } = process.env;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 401, message: 'Invalid token' });
    }
    req.user = decoded;
  });

  // vefiry user in database
  const user = await User.findOne({ where: { email: req.user.email } });

  if (!user) {
    return res.status(401).json({ status: 401, message: 'Invalid token' });
  }

  // update user to verified
  user.is_verified = true;
  user.save();

  // redirect user to frontend, not permanent
  return res.status(301).redirect(`//${VERIFICATION_SUCCESS_URL}`);
};

module.exports = verifyUser;
