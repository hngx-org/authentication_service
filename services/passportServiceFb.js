/*eslint-disable*/
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const dotenv = require('dotenv');
const User = require('../models/Users');
const errorHandler = require('../middleware/ErrorMiddleware');
const { log } = require('../middleware/logger');
const {
  sendWelcomeMail,
} = require('../controllers/MessagingController/sendWelcomeMail');

dotenv.config();
// Facebook Strategy

// const handle
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'emails', 'name'],
      enableProof: true,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        if (!profile._json.email) {
          return cb({
            oauthError: true,
            status: 401,
            message: 'Please set your email on Facebook',
          });
        }
        let user = await User.findOne({
          where: { email: profile._json.email },
        });
        // if user exists, return user
        if (!user) {
          // if user does not exist, create new user
          user = await User.create({
            username: profile.displayName || profile.name.givenName,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: profile._json.email,
            refresh_token: '',
            is_verified: true,
            provider: 'facebook',
          });
          if (user) {
            // new response to sign user in immediately after verification
            const fullName = `${user.first_name} ${user.last_name}`;
            // Todo: add await if needed later
            sendWelcomeMail(fullName, user.email);
          }
        }
        return cb(null, user);
      } catch (err) {
        errorHandler(err, req, res);
        cb(err);
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
