// dotenv config
require("dotenv").config();

// library imports
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

// routes imports
const indexRouter = require("./routes/index");
const userAuthRoutes = require("./routes/auth");
const getAuthRoutes = require("./routes/authorize");
const userUpdateRouter = require("./routes/updateUser");

// middleware imports
const {
  errorLogger,
  errorHandler,
} = require("./middleware/errorHandlerMiddleware");
const { notFound } = require("./middleware/notFound");

const app = express();

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: true,
  optionsSuccessStatus: 204,
};
app.options("*", cors(corsOptions)); // Set up a global OPTIONS handler
app.use(cors(corsOptions)); // Use the configured CORS middleware for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize());

require("./middleware/authEmail")(passport);
require("./middleware/authGithub")(passport);

// route
app.use("/api", indexRouter);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// PLEASE DEFINE ALL AUTHENTICATION ROUTES WITH "/api/auth" OR PUT IN "routes/auth.js" ENSURE NO CONFLICTING ROUTE
app.use("/api/auth", userAuthRoutes);

//communication with other microservices
app.use("/api/authorize", getAuthRoutes);

// THIS IS ROUTE FOR UPDATING USER DETAILS, please ensure all related routes are placed incide the userUpdateRouter
app.use("/api/users", userUpdateRouter);

// Serving Files
app.use(errorLogger);
app.use(errorHandler);

// 404 Route handler
app.use(notFound);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
