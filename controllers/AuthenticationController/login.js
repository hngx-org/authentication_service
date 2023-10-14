const axios = require('axios');
const bcrypt = require('bcrypt');
const User = require('../../models/Users');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.is_verified)
    return res.status(401).json({ message: 'Please verify your account' });

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) return res.status(401).json({ message: 'Invalid password' });
  if (user.two_factor_auth) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await user.update({ refresh_token: code });

    await axios.post(EMAIL_SERVICE_2FA_URL, {
      recipient: email,
      name: user.first_name,
      code,
    });
  }

  req.user = user;
  return next();
};

module.exports = login;
