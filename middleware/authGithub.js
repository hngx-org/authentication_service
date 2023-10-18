/*eslint-disable*/
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const {
  sendWelcomeMail,
} = require('../controllers/MessagingController/sendWelcomeMail');

module.exports = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async function (_accessToken, _refreshToken, profile, done) {
        try {
          if (!profile._json.email) {
            return done({
              oauthError: true,
              status: 401,
              message: 'Please set your email to public on Github',
            });
          }
          let user;
          user = await User.findOne({
            where: { email: profile._json.email },
          });

          // User doesn't exist, create a new user and generate a JWT token.
          if (!user) {
            user = await User.create({
              email: profile._json.email,
              username: profile.username || profile.displayName.split(' ')[0],
              profile_pic: profile._json.avatar_url,
              is_verified: true,
              first_name: profile.displayName.split(' ')[0],
              last_name: profile.displayName.split(' ')[1],
              refresh_token: '',
            });
            if (user) {
              // new response to sign user in immediately after verification
              const fullName = `${user.first_name} ${user.last_name}`;
              // Todo: add await if needed later
              sendWelcomeMail(fullName, user.email);
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  // No need for serializeUser and deserializeUser in JWT-based authentication
};
