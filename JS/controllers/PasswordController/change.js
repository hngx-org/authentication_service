const User = require('../../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/**
 * @description recieves a token from the user, verifies the email and sends a frontend link with token to the user's email
 */
const change = async (req, res, next) => {
  const { token , oldPassword, newPassword } = req.body;
  const { JWT_SECRET } = process.env;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 401, message: 'Invalid token' });
    }
    decodedUser = decoded;
  });

  const user = await User.findOne({ where: { id: decodedUser.id } });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isMatch = bcrypt.compareSync(oldPassword, user.password);
  
  if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({ password: hashedPassword });

  return res.status(200).json({
    status: 200,
    message: 'Password reset successful',
  });
};


module.exports = change;
