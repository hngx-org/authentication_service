const bcrypt = require("bcrypt"); 
const User = require("../models/User");
 const JwtStartegy = require("passport-jwt").Strategy;
 const jwt = require("jsonwebtoken"); 


 const enable2faSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verify2faSchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().required(),
});
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




const enable2fa = async(req, res) => {
  const { error } = enable2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  

 const user = await User.findOne( 
       { where: { email: data.email } 
       } 
  );

if(!user) return res.status(400).json({ message: "User not found" });
 

user.two_factor_enabled = true;
user.save();
  res.status(200).json({ message: '2fa enabled successfully ' });
};



const send2faCode = async(req, res) => {
  const { error } = enable2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  

 const user = await User.findOne( 
       { where: { email: data.email } 
       } 
  );

if(!user) return res.status(400).json({ message: "User not found" });
 

// The middleware for sending code is not ready

// user.token = generatedTpken;


  res.status(200).json({ message: 'You have been sent a code ' });
};


const verify2fa = async (req, res) => {
  const { error } = verify2faSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  

 const user = await User.findOne( 
       { where: { email: data.email } 
       } 
  );

if(!user) return res.status(404).json({ message: "User not found" });
 
const { token } = req.body;
if(user.token !== token) return res.status(400).json({ message: "Code is incorrect" });
 

  res.status(200).json({ 
data: user,
message: '2fa verified successfully' });
};


module.exports = {
 login,
 enable2fa , send2faCode, verify2fa

}