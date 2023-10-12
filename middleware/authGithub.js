const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

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
          let user = await User.findOne({
            where: { email: profile._json.email },
          });
          // console.log({profile});
          if (user) {
            // User already exists, generate a JWT token for them.
            const token = jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET,
              {
                expiresIn: '1d', // Set token expiration as needed
              }
            );
            return done(null, token);
            // return done(null, {user,token});
          } else {
            // User doesn't exist, create a new user and generate a JWT token.
            console.log(profile);
            const newUser = await User.create({
              email: profile._json.email,
              username: profile.username,
              profile_pic: profile._json.avatar_url,
              is_verified: true,
              first_name: profile.displayName.split(' ')[0],
              last_name: profile.displayName.split(' ')[1],
              refresh_token: '',
            });
            // console.log({newUser})
            const token = jwt.sign(
              { userId: newUser._id },
              process.env.JWT_SECRET,
              {
                expiresIn: '1d', // Set token expiration as needed
              }
            );
            return done(null, token);
            // return done(null, {newUser, token})
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // No need for serializeUser and deserializeUser in JWT-based authentication
};
