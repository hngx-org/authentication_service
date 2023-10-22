import passport, { DoneCallback } from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import { Options } from "../../config/github.config";
import { sendWelcomeMail } from "../../controllers/MessagingController";
import User from "../../models/User";
import userService from "../UserService";

passport.use(
  new GitHubStrategy(
    {
      ...Options,
    },
    async function (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile & { _json: { email: string; avatar_url: string } },
      done: DoneCallback,
    ) {
      try {
        if (!profile._json.email) {
          return done(
            Error("Please set your email to public on GitHub"),
            false,
          );
        }
        if (!profile.displayName) {
          return done(Error("Please set your display name on GitHub"), false);
        }
        let user;
        user = await User.findOne({
          where: { email: profile._json.email },
        });

        // User doesn't exist, create a new user and generate a JWT token.
        if (!user) {
          const slug = await userService.slugify(
            profile.displayName.split(" ")[0],
            profile.displayName.split(" ")[1],
          );
          user = await User.create({
            email: profile._json.email,
			slug,
            username: profile.username,
            profilePic: profile._json.avatar_url,
            isVerified: true,
            firstName: profile.displayName.split(" ")[0],
            lastName: profile.displayName.split(" ")[1],
            refreshToken: "",
          });

          if (user) {
            // new response to sign user in immediately after verification
            const fullName = `${user.firstName} ${user.lastName}`;
            // Todo: add await if needed later
            sendWelcomeMail(fullName, user.email);
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: Express.User, done) => {
  done(false, user);
});
