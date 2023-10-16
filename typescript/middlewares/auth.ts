import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Unauthorized } from './error';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const { JWT_SECRET } = process.env;

export function protectdRoute(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Unauthorized('Authentication token required');
  }

  const token = authHeader.split('Bearer ')[1];

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new Unauthorized('Invalid or expired token');
    }

    // Attach the decoded user
    req.user = decoded;

    next();
  });
}
