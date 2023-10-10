const { getGithubUser } = require("../helpers/getGitUser");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

const githubLogin = async (req, res, next) => {
  try {
    const { code, path } = req.query;
    if (!code) {
      throw new Error("no code or in query");
    }
    const githubUser = await getGithubUser(code);
    const { email } = githubUser;
    if (!email) {
      res.status(403).json({
        status: "fail",
        message: "No Email from github",
      });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({
        status: "fail",
        message: "No User with github Account Found.",
      });
    }
    const secret = process.env.JWT_SECRET;
    const payload = { id: user.id };
    const token = jwt.sign(payload, secret);

    return res.status(200).json({ token, data: user, statusCode: 200 });
  } catch (error) {
    next(error)
  }
};

module.exports = {
  githubLogin,
};
