const User = require("../models/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config();


function checkIfUserIsAdmin(user) {
  // Assuming role_id 3 corresponds to the admin role
  return user.role_id === 3;
}

async function getAllUsers(req, res) {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.replace("Bearer ", "");

    // Verify and decode the JWT token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
      }

      // The 'decoded' object hopefully contains the data from the JWT
      const userId = decoded.id;

      // I'm using 'userId' to query the user's information from the database
      User.findOne({ where: { id: userId } })
        .then(user => {
          if (!user) {
            return res.status(404).json({ message: "Authenticated User not found." });
          }

          
          const userIsAdmin = checkIfUserIsAdmin(user);

          if (userIsAdmin) {
            // If the user is an admin, retrieve the list of users
            User.findAll().then(users => {
              res.status(200).json({
                success: true,
                data: users,
              });
            });
          } else {
            res.status(403).json({ message: "Access denied. Admin privilege required." });
          }
        })
        .catch(error => {
          res.status(500).json({ message: "Error fetching users", error: error.message });
        });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

module.exports = { getAllUsers };