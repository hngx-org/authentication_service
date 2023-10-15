const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const dotenv = require('dotenv');
const User = require('../models/Users');
const errorHandler = require('../middleware/ErrorMiddleware');

dotenv.config();
// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      enableProof: true,
    },
    async (req, res, accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });
        // if user exists, return user
        if (!user) {
          // if user does not exist, create new user
          user = await User.create({
            facebookId: profile.id,
            username: profile.displayName,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: profile.emails[0].value,
            refresh_token: '',
          });
        }
        return cb(null, user)
      } catch {
        errorHandler(err, req, res);
      }
    },
  ),
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
