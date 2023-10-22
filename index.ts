import express from 'express';
import sequelize from './config/db.config';
import userRouterHandler from './routes/userRouter';
import rbacRouterHandler from './routes/rbacRouter';
import authRouter from './routes/authRouter';
import swaggerDocument from './swagger_output.json';
import swaggerUi from 'swagger-ui-express';

import cors from 'cors';
import { config } from 'dotenv'; // ES6 import for dotenv
import { errorHandler, routeNotFound } from './middlewares/error';

config(); // Load environment variables from .env file

const app = express();

app.options('*',cors());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.error('Error creating database and tables:', err);
  });

app.use('/api/auth/api/auth', userRouterHandler);
app.use('/api/auth/api/roles', rbacRouterHandler);
app.use('/api/auth/api/authorize', authRouter);
// app.use('/api/auth/api/docs', swaggerRouter);
app.use('/api/auth/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(errorHandler);
app.use(routeNotFound);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;
