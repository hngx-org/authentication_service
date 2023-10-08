const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Options } = require("../config/gauth.config");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      ...Options,
      passReqToCallback: true,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ email: user.email });
        if (!user)
          user = await User.create({
            username: profile.displayName,
            first_name: profile.name.givenName,
            last_name: profile.name.giveName,
            email: profile.email,
            refreshToken: "....",
          });

        if (!user) throw new Error("Errors");

        cb(false, user);
      } catch (err) {
        cb(Error("Error"));
      }
    }
  )
);

passport.serializeUser = (user, done) => {
  done(false, user.dataValues());
};
