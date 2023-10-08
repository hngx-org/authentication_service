const jwt = require("jsonwebtoken");

const handleAuth = (req, res) => {
  const { user } = req;
  const payload = {
    id: user.id,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
  return res.json({
    token: accessToken,
    data: user,
    statusCode: 200,
  });
};

module.exports = { handleAuth };
