const bcrypt = require("bcrypt"); 
const User = require("../models/User");
 const JwtStartegy = require("passport-jwt").Strategy;
 const jwt = require("jsonwebtoken"); 

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


module.exports = {
 login
}