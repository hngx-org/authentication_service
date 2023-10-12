require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerUi');
const swaggerDocument = require('./swagger.json'); // Load your Swagger JSON file
const sampleRoutes = require('./routes/demo');
const passport = require('passport');
const defineRolesandPermissions = require('./helpers/populate');
const userRoute = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const getAuthRoutes = require('./routes/getAuth');
const { gauthRoutes } = require("./routes/gauthRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const sequelize = require('./config/db');
const UserPermissions = require('./models/UserPermissions');

sequelize.authenticate().then(async () => {
  await sequelize.sync();
  await UserPermissions.sync();
  // populate roles and permissions if not already populated
  await defineRolesandPermissions();
});

app.use(passport.initialize());
require('./middleware/authEmail')(passport);

app.use("/api", gauthRoutes);


// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use your API routes
app.use('/api', sampleRoutes);

// Routes
app.use('/auth', userRoute);
// require('./routes/userRoutes')(app);

app.use('/api/auth', authRoutes);
app.use('/api/get-auth', getAuthRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
