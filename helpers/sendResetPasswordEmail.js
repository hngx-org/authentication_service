const axios = require("axios");

async function sendResetEmail(name, recipient, token) {
  try {
    const emailServiceUrl = `${process.env.EMAIL_SERVICE_URL}/api/v1/user/password-reset`;

    const reset_link = `${process.env.AUTH_FRONTEND_URL}/auth/reset-password/?token=${token}`;

    const response = await axios.post(emailServiceUrl, {
      name,
      recipient,
      reset_link,
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

module.exports = { sendResetEmail };
