const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Options } = require("../config/gauth.config");
const User = require("../models/Users");

// passport.use(
//   new GoogleStrategy(
//     {
//       ...Options,
//       passReqToCallback: true,
//     },
//     async (request, accessToken, refreshToken, profile, cb) => {
//       try {
//         let user = await User.findOne({
//           where: { email: profile.emails[0].value },
//         });
//         if (!user)
//           user = await User.create({
//             username: profile.displayName,
//             first_name: profile.name.givenName,
//             last_name: profile.name.familyName,
//             email: profile.emails[0].value,
//             refresh_token: "",
//             is_verified: true,
//             provider: "google",
//           });

//         if (!user) throw new Error("Errors");
//         request.user = user;
//         cb(false, user);
//       } catch (err) {
//         cb(err);
//       }
//     }
//   )
// );

passport.serializeUser((user, done) => {
  done(false, user.dataValues);
});