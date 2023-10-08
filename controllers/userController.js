const bcrypt = require("bcrypt"); 
const User = require("../models/User");
const JwtStartegy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken"); 
const transporter = require("../middleware/mailConfig")
const validator = require("validator")

async function login(req,res){
 const data = req.body;
 const user = await User.findOne(
      { where: { email: data.email }
      }
 );
 if (user){
   const checkPassword = bcrypt.compareSync(data.password, user.password);
 if (!checkPassword) {
   return res.json("Incorrect passsword")
 } else {
   const jwt_payload = { 
    
    id:user.id,
   }
   const token = jwt.sign(jwt_payload, process.env.jwtSecret); 

   return res.json(
      { "token":token,
         "data":user,
          "statusCode":200
       }
      )
  }
 } else {
   return res.json("User not found ")
  }
};


const sendVerificationCode = async (req, res) => {
  const { first_name, last_name, username, email, password, refresh_token } = req.body

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
      first_name,
      last_name,
      username,
      email,
      password,
      refresh_token,
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
      user.is_verified = true;
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
 login,
 sendVerificationCode,
 confirmVerificationCode
}