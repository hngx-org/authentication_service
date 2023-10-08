const User = require("../models/")  //Assuming there is user model but there isn't at the moment
const transporter = require("../middlware/mailConfig")
const validator = require("validator")

const sendVerificationCode = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body

    // Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format.',
        });
    }

    // Generating a random 6 digit verification code
    const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
    ).toString();


    await User.create({
        firstname,
        lastname,
        username,
        email,
        password,
        token: verificationCode, // There is meant to be a place Store the verification code in the database so it can be verified later
    })

    // Send an email with the verification code
    const mailOptions = {
        from: 'testemail@gmail.com', // Your email address
        to: email, // User's email address
        subject: 'Email Verification',
        text: `Your verification code is: ${verificationCode}`,
    };

    // Sending the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
        message: 'Verification code sent successfully',
    });
}

const confirmVerificationCode = async (req, res) => {
    try {
        const { email, verificationCode } = req.body

        // Validate email and verification code
        if (!email || !verificationCode) {
            return res.status(400).json({
                success: false,
                message: 'Email and verification code are required.',
            });
        }

        // Verifing the verification code against the stored code in your database
        const user = await User.findOne({
            where: { email, token: verificationCode },
        });

        if (!user || user.token !== verificationCode) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or verification code.',
                data: null,
            });
        }

        // Mark the email as verified
        user.email = true;
        user.token = null; // Optional, clear the verification code from the database or not
        //  There is supposed to be a field where we set the state to be true once token is validated

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Token verified',
        });
    } catch (error) {
        res.send(error.message)
    }
}

module.exports = {
    sendVerificationCode,
    confirmVerificationCode
}