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
          let user;
          user = await User.findOne({
            where: { email: profile._json.email },
          });

          // User doesn't exist, create a new user and generate a JWT token.
          if (!user)
          {
            user = await User.create({
            email: profile._json.email,
            username: profile.username,
            profile_pic: profile._json.avatar_url,
            is_verified: true,
            first_name: profile.displayName.split(' ')[0],
            last_name: profile.displayName.split(' ')[1],
            refresh_token: '',
          });
          }
          
          const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            {
              expiresIn: '1d', // Set token expiration as needed
            },
          );
          const toRespond = {
          status: 200,
          message: 'Login successful',
          data: {
          token,
          user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          is_verified: user.is_verified,
          two_factor_auth: user.two_factor_auth
      },
    },
  }
          return done(null, toRespond);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  // No need for serializeUser and deserializeUser in JWT-based authentication
};
