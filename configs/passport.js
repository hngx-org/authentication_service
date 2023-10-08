const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (payload, done) => {
      // You can perform additional checks here, e.g., fetching user from a database
      return done(null, payload);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Here you can save or fetch user data from a database
      const user = await User.findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          is_verified: true,
          profile_pic:
            profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : null,
        },
      });
      // Create a JWT token for the user
      const token = jwt.sign(user, process.env.JWT_SECRET);

      // Pass the user and token to the next middleware
      return done(null, { user, token });
    }
  )
);

module.exports = passport;
