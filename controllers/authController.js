const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const User = require('../models/user.model'); ---- still waiting on this user model!!



const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password) => /^(?=.*[0-9!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);
// valid password should be at least 8 characters with at least one symbol or number

async function createUser(req, res, next) {
    try {
      const {
        firstName, 
        lastName,
        email,
        password,
        isAdmin, //there were no admin roles in the schema!!!
      } = req.body;
  
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if(!validateEmail(email)){
        return res.status(400).json({ error: 'Incorrect email format' });
      }

      if(!validatePassword(password)){
        return res.status(400).json({ error: 'Password should be at least 8 characters with at least one symbol or number' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = {
        firstName, 
        lastName,
        email,
        passwordHash: hashedPassword,
        isAdmin,
        verificationStatus: false,
      };
  
    //   const newUser = await User.create(user); -- Pls uncomment this when the user model is ready
  
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user: newUser,
        },
      });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Unique constraint violation (duplicate email)
            const errorMessage = error.errors[0].message;
            return res.status(400).json({ error: errorMessage });
          }
      next(error.message);
    }
  }
  