const JwtStrategy = require("passport-jwt").Strategy; 
const models = require("../models/index");

const ExtractJwt = require("passport-jwt").ExtractJwt; 

const users = models.user; 

const jwtOptions ={} 

jwtOptions.jwtFromRequest =ExtractJwt.fromAuthHeaderAsBearerToken(); // adding a jwtFromrequest method to your jwtOptions object;
jwtOptions.secretOrKey = process.env.jwtSecret; 

module.exports = passport => { 

passport.use(new JwtStrategy( jwtOptions,(jwt_payload,done) =>{ 
   users.findOne({where:{id:jwt_payload.id}}) 
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
