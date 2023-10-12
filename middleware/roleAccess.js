const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const User = require("../models/Users");

const verifyJwt = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    
    if (!authHeader) return res.status(400).json({
      "status": 400,
      "success": false,
      "Error": "Bad request"
    });;

    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret, (err, decoded) => {
      
      if (err) return res.status(400).json({
        "status": 400,
        "success": false,
        "Error": err.message
      });
      
      req.body = decoded;
      next();
    });
  };
  
function checkRole(roleId = []) {
    return async function(req, res, next) {
      console.log(roleId)
      const user = await User.findByPk(req.body.id);
      if (user && roleId.includes(user.role_id)) {
        next();
      } else {
        return res.status(403).json({
          "status": 403,
          "success": false,
          "Error": "Restricted Access"
        });;
      }
    };
  }


module.exports = {verifyJwt, checkRole};