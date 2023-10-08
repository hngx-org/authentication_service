const axios = require("axios");
const querystring = require("querystring");
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

const getGithubUser = async (code) => {
  try {
    const githubToken = await axios
      .post(
        `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`
      )
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
    const decoded = querystring.parse(githubToken);
    const accessToken = decoded.access_token;

    return axios
      .get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getGithubUser,
};
