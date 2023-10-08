require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'HNGx',resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/githubStrategy');

// Routes
const authRoutes = require('./routes/auth');

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
