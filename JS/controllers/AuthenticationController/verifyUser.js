const jwt = require('jsonwebtoken');
const User = require('../../models/Users');
const { sendWelcomeMail } = require('../MessagingController/sendWelcomeMail');

const verifyUser = async (req, res, next) => {
  // validate this also
  const { token } = req.params;
  const { SIGN_UP_JWT_SECRET } = process.env;

  try {
    const decodedUser = jwt.verify(token, SIGN_UP_JWT_SECRET);

    // verify user in database
    const user = await User.findOne({ where: { email: decodedUser.email } });

    if (!user) {
      return res.status(401).json({ status: 401, message: 'Invalid token' });
    }

    // update user to verified
    user.is_verified = true;
    user.save();

    req.user = user;
    // new response to sign user in immediately after verification
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyUser;
