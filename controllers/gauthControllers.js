const jwt = require("jsonwebtoken");

const handleAuth = (req, res) => {
  const { user } = req;
  const payload = {
    id: user.id,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
  return res.json({
    token: accessToken,
    data: {
      ...user.dataValues,
      token: undefined,
      password: undefined,
      refresh_token: undefined,
      two_factor_auth: undefined,
    },
    statusCode: 200,
  });
};

module.exports = { handleAuth };
