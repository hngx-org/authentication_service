const User = require('../models/Users');
const session = require('express-session');
const errorHandler = require('../middleware/ErrorMiddleware');

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
        errorHandler(err, req, res);
    }
};

module.exports = { authFacebook };