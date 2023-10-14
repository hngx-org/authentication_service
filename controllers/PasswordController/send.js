const User = require('../../models/Users');

/**
 * @description recieves an email from the user, verifies the email and sends a frontend link with token to the user's email
 */
const send = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  req.user = {
    id: user.id,
    firstName: user.first_name,
    email: user.email,
  };

  next();
};

module.exports = send;
