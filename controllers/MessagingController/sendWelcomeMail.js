const axios = require('axios');

// Todo: mark here

async function sendWelcomeMail(name, recipient) {
    try {
        const emailServiceUrl = `${process.env.EMAIL_SERVICE_WELCOME_URL}`;
        const redirectLink = `${process.env.AUTH_FRONTEND_DASHBOARD_URL}`;

        const response = await axios.post(emailServiceUrl, {
            name,
            recipient,
            call_to_action: redirectLink,
        });

        if (response.status === 200) {
            console.log('Welcome email sent successfully.');
        } else {
            console.error('Failed to send welcome email.');
        }
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
}

module.exports = {sendWelcomeMail};