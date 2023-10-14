const jwt = require('jsonwebtoken');
const errorHandler = require('../../middleware/ErrorMiddleware');

// handling facebook auth callback
const authFacebook = (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.session.userId = user.id;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.header('Authorization', `Bearer ${token}`);
    res.status(200).json({
    status: 200,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        is_verified: user.is_verified,
        two_factor_auth: user.two_factor_auth
      },
    },
  });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

module.exports = authFacebook;
