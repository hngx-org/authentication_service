import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

// dotenv config
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);