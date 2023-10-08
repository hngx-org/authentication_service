const express = require('express');
const { getAuth } = require('../controllers/getAuth');
const passport = require('../configs/passport');
const router = express();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth2 callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Redirect or send response with the JWT token
    res.json({ user: req.user.user, token: req.user.token });
  }
);

module.exports = router;
