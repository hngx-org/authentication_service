import passport from "passport";
import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import User from "../../models/User";
import { Options } from "../../config/facebook.config";
import { sendWelcomeMail } from "../../controllers/MessagingController";
import userService from "../UserService";

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      ...Options,
      passReqToCallback: true,
      enableProof: true,
    },
    async (
      req,
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      cb,
    ) => {
      try {
        let user = await User.findOne({
          where: { email: profile.emails[0].value },
        });
        // if user exists, return user

        if (!user) {
          // if user does not exist, create new user
          const slug = await userService.slugify(
            profile.name.givenName,
            profile.name.familyName,
          );

          user = await User.create({
            username: profile.displayName,
            slug,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            refreshToken: "",
          });

          sendWelcomeMail(`${user.firstName} ${user.lastName}`, user.email);
        }
        return cb(null, user);
      } catch (err) {
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
