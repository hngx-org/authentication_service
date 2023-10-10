const GitHubStrategy = require("passport-github2").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/redirect",
      },
      async function (_accessToken, _refreshToken, profile, done) {
        try {
          let user = await User.findOne({ email: profile._json.email });

          if (user) {
            // User already exists, generate a JWT token for them.
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
              expiresIn: "1d", // Set token expiration as needed
            });
            return done(null, token);
          } else {
            // User doesn't exist, create a new user and generate a JWT token.
            const newUser = await User.create({
              email: profile._json.email,
              username: profile.username,
              profile_pic: profile._json.avatar_url,
              is_verified: true,
              first_name: profile.displayName,
              last_name: profile.displayName,
            });
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
              expiresIn: "1d", // Set token expiration as needed
            });
            return done(null, token);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // No need for serializeUser and deserializeUser in JWT-based authentication
};
