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
      let user = await User.findOne({ email: user.email });
      if (!user)
        user = await User.create({
          username: profile.displayName,
        });
    }
  )
);
