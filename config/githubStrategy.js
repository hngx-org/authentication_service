const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require("../models/User");

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/redirect"
  },
  async function(accessToken, refreshToken, profile, done) {
    console.log({accessToken, refreshToken, profile});
    done(null, false, "github ioonni")
    User.findOr({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.serializeUser((user, done) =>{
    done(null, user.id)
  })
  
  passport.deserializeUser((id, done) =>{
    User.findById(id).then((user) =>{
      done(null, user)
    })
  })