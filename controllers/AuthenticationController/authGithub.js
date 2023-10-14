const jwt = require('jsonwebtoken');
const { getGithubUser } = require('../../helpers/getGitUser');
const User = require('../../models/Users');
const {GITHUB_LCLIENT_ID} = process.env;
const {GITHUB_REDIRECT_URL} = process.env;

const handleGithubAUth = (req, res) => {
  // Successful GitHub authentication, generate a JWT token
  const token = req.user;
  if (token) {
    // Redirect to a client page with the token or send it as a JSON response
    res.json({ token });
  } else {
    // Handle authentication failure
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const githubLogin = async (req, res) => {
  try {
    return res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_LCLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URL}?path=/&scope=user:email`,
    );
  } catch (error) {
    throw new Error(error);
  }
};

const githubRedirectUrl = async (req, res) => {
  try {
    const { code, path } = req.query;
    if (!code) {
      throw new Error('no code or in query');
    }
    let githubUser = await getGithubUser(code);
    githubUser = githubUser.filter((user) => {
      return user.primary == true;
    });
    console.log(githubUser);
    const { email } = githubUser[0];
    if (!email) {
      return res.status(403).json({
        status: 'fail',
        message: 'No Email from github',
      });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'No User with github Account Found.',
      });
    }
    const secret = process.env.JWT_SECRET;
    const payload = { id: user.id };
    const token = jwt.sign(payload, secret, {
      expiresIn: '1d',
    });

    return res.status(200).json({ token, data: user, statusCode: 200 });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  handleGithubAUth,
  githubLogin,
  githubRedirectUrl,
};

