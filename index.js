// dotenv config
require('dotenv').config();

// library imports
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

// routes imports
const indexRouter = require('./routes/index');
const userAuthRoutes = require('./routes/auth');
const userUpdateRouter = require('./routes/updateUser');

// middleware imports
const {
  errorLogger,
  errorHandler,
} = require('./middleware/errorHandlerMiddleware');
const { notFound } = require('./middleware/notFound');

const app = express();
app.use('proxy', true);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'https://staging.zuri.team'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true, // Enable preflight requests
  credentials: true,
  optionsSuccessStatus: 204, // Use 204 No Content for preflight success status
};

// const handlePreflight = (req, res, next) => {
// Set the CORS headers for the preflight request
//  res.setHeader("Access-Control-Allow-Origin", ["http://localhost:3000", "http://localhost:3002", "https://zuriportfolio-frontend-pw1h.vercel.app"]);
// res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH");
// res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

// Respond to the OPTIONS request with a 204 No Content status
// if (req.method === "OPTIONS") {
// return res.status(204).end();
// }

// Pass the request to the next middleware
// next();
// };

// app.use(handlePreflight)

app.options('*', cors(corsOptions)); // Set up a global OPTIONS handler
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

require('./middleware/authEmail')(passport);
require('./middleware/authGithub')(passport);

// index route

app.use('/api/auth/api', indexRouter);

// PLEASE DEFINE ALL AUTHENTICATION ROUTES WITH "/api/auth" OR PUT IN "routes/auth.js" ENSURE NO CONFLICTING ROUTE
app.use('/api/auth/auth', userAuthRoutes);

// THIS IS ROUTE FOR UPDATING USER DETAILS, please ensure all related routes are placed incide the userUpdateRouter
app.use('/api/auth/users', userUpdateRouter);

// Serving Files
app.use(errorLogger);
app.use(errorHandler);

// 404 Route handler
app.use(notFound);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
