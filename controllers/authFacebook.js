const jwt = require('jsonwebtoken');
const errorHandler = require('../middleware/ErrorMiddleware');

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
    res.status(200).json({
      message: 'User logged in successfully',
      token,
      user,
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

module.exports = { authFacebook };
