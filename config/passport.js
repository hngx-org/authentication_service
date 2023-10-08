const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/User");

const jwt_options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JWTStrategy(jwt_options, (jwt_payload, done) => {}),
  new LocalStrategy((username, password, done) => {}),
  new GoogleStrategy({}, (accessToken, refreshToken, profile, done) => {}),
);

module.exports = passport;
