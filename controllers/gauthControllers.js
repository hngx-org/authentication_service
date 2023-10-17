const jwt = require('jsonwebtoken');

const handleAuth = (req, res) => {
  const { user } = req;
  const payload = {
    id: user.id,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 24 * 60 * 60,
  });
  return res.json({
    status: 200,
    message: 'Login successful',
    data: {
      token: accessToken,
      user:{
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        is_verified: user.is_verified,
        two_factor_auth: user.two_factor_auth
      }
    }
  });
};

module.exports = { handleAuth };
