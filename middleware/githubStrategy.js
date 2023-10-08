const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/redirect",
      },
      async function (accessToken, refreshToken, profile, done) {
     
        let user = await User.findOne({ email: profile._json.email });
        if (user) {
          return done(null, false, { message: "User already exists." });
        }
        let newUser = await User.create({
          email: profile._json.email,
          username: profile.username,
          profile_pic: profile._json.avatar_url,
          is_verified: true,
          first_name: profile.displayName,
          last_name: profile.displayName,
        });
        console.log({newUser});
        done(null, newUser);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });
};
