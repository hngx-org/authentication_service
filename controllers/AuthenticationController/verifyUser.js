const jwt = require('jsonwebtoken');
const User = require('../../models/Users');

const verifyUser = async (req, res, next) => {
  const { token } = req.params;
  const { JWT_SECRET } = process.env;

  let decodedUser

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 401, message: 'Invalid token' });
    }
    decodedUser = decoded;
  });

  // verify user in database
  const user = await User.findOne({ where: { email: decodedUser.email } });

  if (!user) {
    return res.status(401).json({ status: 401, message: 'Invalid token' });
  }

  // update user to verified
  user.is_verified = true;
  user.save();

  req.user = user
   // new response to sign user in immediately after verification
  const fullName = `${user.first_name} ${user.last_name}`;
  sendWelcomeMail(fullName, user.email);
  return next();
};

module.exports = verifyUser;
