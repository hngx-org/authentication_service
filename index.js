require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./configs/connectDb.js');
const passport = require('./configs/passport.js');
const defineRolesandPermissions = require('./helpers/populate.js');
const authRouter = require('./routes/auth.js');
const getAuthRouter = require('./routes/getAuth.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// conncect db
sequelize
  .authenticate()
  .then(async () => {
    console.log('database connected');

    // populate roles and permissions if not already populated
    await defineRolesandPermissions();
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.use('/auth', authRouter);
app.use('/get-auth', getAuthRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
