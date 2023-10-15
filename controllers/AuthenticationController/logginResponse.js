const jwt = require('jsonwebtoken');

const loginResponse = async (req, res) => {
  const { user } = req;
  const jwtPayload = {
    id: user.id,
  };
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET);

  res.header('Authorization', `Bearer ${token}`);

  return res.status(200).json({
    status: 200,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user.id,
        roleId: user.role_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        is_verified: user.is_verified,
        two_factor_auth: user.two_factor_auth,
      },
    },
  });
};
module.exports = loginResponse;
