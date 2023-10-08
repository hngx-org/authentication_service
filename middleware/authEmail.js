const JwtStrategy = require("passport-jwt").Strategy; 
const User = require("../models/User");

const ExtractJwt = require("passport-jwt").ExtractJwt; 

const jwtOptions ={} 

jwtOptions.jwtFromRequest =ExtractJwt.fromAuthHeaderAsBearerToken(); // adding a jwtFromrequest method to your jwtOptions object;
jwtOptions.secretOrKey = process.env.jwtSecret; 

module.exports = passport => { 

passport.use(new JwtStrategy( jwtOptions,(jwt_payload,done) =>{ 
   User.findOne({where:{id:jwt_payload.id}}) 
   .then(user =>{ 
   if(user){ 
     return done(null,user); 
   }
   return done(null,false); 
   })
  .catch(err =>{ 
     console.log(err); 
   });
  }
 ));
};
