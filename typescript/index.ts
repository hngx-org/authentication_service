import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';


// dotenv config
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv'

const myEnv = dotenv.config();

dotenvExpand.expand(myEnv);

import sequelize from "./config/db.config";

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

sequelize.sync({force:true}).then(() => {
  console.log('Database & tables created!');
}   ).catch((err) => {
  console.log(err);
}
);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
