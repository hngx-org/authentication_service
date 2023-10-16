import express from 'express';
import sequelize from './config/db.config';
import userRouterHandler from './routes/userRouter';
import rbacRouterHandler from './routes/rbacRouter';

import cors from 'cors';
import dotenv from 'dotenv'; // ES6 import for dotenv

dotenv.config(); // Load environment variables from .env file


const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.error('Error creating database and tables:', err);
  });

app.use('/api/auth', userRouterHandler);
rbacRouterHandler
app.use('/api/auth', rbacRouterHandler);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;
