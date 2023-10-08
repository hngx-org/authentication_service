require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const defineRolesandPermissions = require("./helpers/populate");
const userRoute = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sequelize = require("./config/db");

sequelize.authenticate().then(async () => {
  // populate roles and permissions if not already populated
  await defineRolesandPermissions();
});

app.use(passport.initialize());
require("./middleware/authEmail")(passport);

// Routes
app.use("/auth", userRoute);
// require('./routes/userRoutes')(app);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
