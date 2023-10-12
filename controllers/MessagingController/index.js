const sendSignUpEmail = require('./sendSignUpEmail');
const resendVerificationEmail = require('./resendVerificationEmail');

const MessagingController = {
	sendSignUpEmail,
	resendVerificationEmail,
};

module.exports = MessagingController;
