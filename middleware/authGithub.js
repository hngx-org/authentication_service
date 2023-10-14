const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const {sendWelcomeMail} = require("../controllers/MessagingController/sendWelcomeMail");

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
            return done(
              null,
              false,
              'Please set your email to public on GitHub',
            );
          }
          if (!profile.displayName) {
            return done(null, false, 'Please set your display name on GitHub');
          }

          const user = await User.findOne({
            where: { email: profile._json.email },
          });

          if (user) {
            // User already exists, generate a JWT token for them.
            const token = jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET,
              {
                expiresIn: '1d', // Set token expiration as needed
              },
            );
            return done(null, { token, data: user });
          }
          // User doesn't exist, create a new user and generate a JWT token.
          const newUser = await User.create({
            email: profile._json.email,
            username: profile.username,
            profile_pic: profile._json.avatar_url,
            is_verified: true,
            first_name: profile.displayName.split(' ')[0],
            last_name: profile.displayName.split(' ')[1],
            refresh_token: '',
          });

          // Todo: subject to improvement
          const fullName = `${user.first_name} ${user.last_name}`;
          // Todo: add await if needed
          sendWelcomeMail(fullName, user.email)

          const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            {
              expiresIn: '1d', // Set token expiration as needed
            },
          );
          return done(null, { token, data: user });
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  // No need for serializeUser and deserializeUser in JWT-based authentication
};
