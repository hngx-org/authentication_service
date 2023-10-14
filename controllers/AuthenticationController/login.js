const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/Users');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.is_verified)
    return res.status(401).json({ message: 'Please verify your account' });

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

  req.user = user;
  return next();
  // const jwt_payload = {
  //   id: user.id,
  // };

  // const token = jwt.sign(jwt_payload, process.env.JWT_SECRET);

  // res.header('Authorization', `Bearer ${token}`);

  // return res.status(200).json({
  //   status: 200,
  //   message: 'Login successful',
  //   data: {
  //     token,
  //     user: {
  //       id: user.id,
  //       firstName: user.first_name,
  //       lastName: user.last_name,
  //       email: user.email,
  //       is_verified: user.is_verified,
  //       two_factor_auth: user.two_factor_auth,
  //     },
  //   },
  // });
};

module.exports = login;
