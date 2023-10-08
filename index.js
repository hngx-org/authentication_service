require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'HNGx',resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require('./routes/AuthRoutes');

// Sync the model with the database
const sequelize = require("./config/db");

sequelize.authenticate();


require('./middleware/authEmail')(passport); 
require('./middleware/githubStrategy')(passport);
// Routes
require('./routes/userRoutes')(app);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
