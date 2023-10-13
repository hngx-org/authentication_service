const sendSignUpEmail = require('./sendSignUpEmail');
const resendVerificationEmail = require('./resendVerificationEmail');
const sendPasswordResetEmail = require('./sendPasswordResetEmail');

const MessagingController = {
	sendSignUpEmail,
	resendVerificationEmail,
	sendPasswordResetEmail,
};

module.exports = MessagingController;
