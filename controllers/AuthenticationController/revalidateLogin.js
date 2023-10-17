const jwt = require('jsonwebtoken');
const User = require('../../models/Users');

const revalidateLogin = async (req, res) => {
  const { token } = req.params;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid token',
      });
    }

    const { id } = decoded;
    const user = await User.findByPk(id)
    if (!user) {
      res.status(404).json({ mssg: "user not found" })
    }
    res.header('Authorization', `Bearer ${token}`);

    return res.status(200).json({
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
  });
}
module.exports = revalidateLogin
