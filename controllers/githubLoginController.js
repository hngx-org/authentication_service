const { getGithubUser } = require("../helpers/getGitUser");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const {
  ResourceNotFound,
  Unauthorized,
  BadRequest,
  Conflict,
  Forbidden,
  ServerError,
} = require("../errors/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  ACCESS_DENIED,
  INVALID_TOKEN,
  MISSING_REQUIRED_FIELD,
  INVALID_REQUEST_PARAMETERS,
  EXISTING_USER_EMAIL,
  EXPIRED_TOKEN,
  CONFLICT_ERROR_CODE,
  THIRD_PARTY_API_FAILURE,
} = require("../errors/httpErrorCodes");
const clientId = process.env.GITHUB_LCLIENT_ID;
const redirectUrl = process.env.GITHUB_REDIRECT_URL
const githubLogin = async (req, res) => {
try {
  return res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}?path=/&scope=user:email`)
} catch (error) {
  throw new Error(error)
}
};

const githubRedirectUrl = async(req,res)=>{
  try {
    const { code, path } = req.query;
    if (!code) {
      throw new Error("no code or in query");
    }
    let githubUser = await getGithubUser(code)
    githubUser = githubUser.filter((user)=>{
      return user.primary == true
      });
    console.log(githubUser)
    const { email } = githubUser[0];
    if (!email) {
     return res.status(403).json({
        status: "fail",
        message: "No Email from github",
      });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "No User with github Account Found.",
      });
    }
    const secret = process.env.JWT_SECRET;
    const payload = { id: user.id };
    const token = jwt.sign(payload, secret, {
      expiresIn : '1d'
    });

    return res.status(200).json({ token, data: user, statusCode: 200 });
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  githubLogin,
  githubRedirectUrl
};
