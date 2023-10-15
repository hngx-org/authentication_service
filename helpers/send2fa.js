/*eslint-disable */
const axios = require('axios');

require('dotenv').config();


const send2fa = async (user) => {
    const EMAIL_SERVICE_2FA_URL = process.env.EMAIL_SERVICE_2FA_URL;

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const responseObj = {}

    await user.update({ refresh_token: code });

    try {
        const response = await axios.post(EMAIL_SERVICE_2FA_URL, {
            recipient: user.email,
            name: user.first_name,
            code,
        });

        if (response.status === 200) {
            responseObj.status = 200
            responseObj.message = "2fa code sent"
        }
    }
    catch (error) {
        responseObj.status = 500
        responseObj.message = "internal server error"
        responseObj.error = error
    }
    return responseObj;
}

module.exports = send2fa;