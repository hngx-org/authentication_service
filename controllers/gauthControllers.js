const jwt = require("jsonwebtoken");

const handleAuth = (req, res) => {
  const { user } = req;
  console.log("got here");
  const payload = {
    id: user.id,
  };
  const accessToken = jwt.sign(payload, process.env.jwtSecret);
  return res.json({
    token: accessToken,
    data: user,
    statusCode: 200,
  });
};

module.exports = { handleAuth };
