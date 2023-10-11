const User = require('../models/Users');
const session = require('express-session');

// handling facebook auth callback
const authFacebook = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.session.userId = user.id;

        res.status(200).json({ message: 'User logged in successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { authFacebook };