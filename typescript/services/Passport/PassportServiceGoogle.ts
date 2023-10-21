import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import passport from 'passport';
import User from '../../models/User';
import {Options} from '../../config/google.config';
import {Profile, VerifyCallback} from 'passport-google-oauth20';
import {sendWelcomeMail} from "../../controllers/MessagingController";

passport.use(
  new GoogleStrategy(
    {
      ...Options,
      passReqToCallback: true,
    },
    async (request, _accessToken: string, _refreshToken: string, profile: Profile, cb: VerifyCallback) => {
      try {
        let user = await User.findOne({
          where: {email: profile.emails[0].value},
        });
        if (!user) {
          user = await User.create({
            username: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            refreshToken: '',
            isVerified: true,
            provider: 'google',
          });

          if (user) {
            // new response to sign user in immediately after verification
            const fullName = `${user.firstName} ${user.lastName}`;
            // Todo: add await if needed later
            sendWelcomeMail(fullName, user.email);
          }

        }
        if (!user) {
          throw new Error('Unable to get or create user');
        }
        request.user = user;
        cb(null, user);
      } catch (err) {
        cb(err);
      }
    },
  ),
);

passport.serializeUser((user: Express.User, done) => {
  done(false, user);
});
