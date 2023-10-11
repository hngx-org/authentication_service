const axios = require("axios");

async function sendVerificationEmail(name, recipient, token) {
  try {
    const emailServiceUrl = `${process.env.EMAIL_SERVICE_URL}/api/v1/user/email-verification`;

    const verification_link = `${process.env.AUTH_FRONTEND_URL}/auth/verification-complete/?token=${token}`;

    const response = await axios.post(emailServiceUrl, {
      name,
      recipient,
      verification_link,
    });

    if (response.status === 200) {
      console.log("Verification email sent successfully.");
    } else {
      console.error("Failed to send verification email.");
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendVerificationEmail };
