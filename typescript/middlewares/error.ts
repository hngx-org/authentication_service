/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
// import { AuthErrorHandler } from '../exceptions/AuthErrorHandler';

class HttpError extends Error {
  statusCode: number;
  errorCode: number;
  status: string = 'error';

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = statusCode;
  }
}

class BadRequest extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}

class ResourceNotFound extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}

class Unauthorized extends HttpError {
  constructor(message: string) {
    super(401, message);
  }
}

class Forbidden extends HttpError {
  constructor(message: string) {
    super(403, message);
  }
}

class Conflict extends HttpError {
  constructor(message: string) {
    super(409, message);
  }
}

class InvalidInput extends HttpError {
  constructor(message: string) {
    super(422, message);
  }
}

class ServerError extends HttpError {
  constructor(message: string) {
    super(500, message);
  }
}

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  const message = `Route not found: ${req.originalUrl}`;
  res.status(404).json({ status: 'error', statusCode: 404, message });
};

const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, status, message } = err;
  const cleanedMessage = message.replace(/"/g, '');
  res.status(statusCode).json({
    status,
    statusCode,
    message: cleanedMessage,
  });
};

// const errorHandler = (
//   err: Error | AuthErrorHandler,
//   req: Request,
//   res: Response
// ) => {
//   if (err instanceof AuthErrorHandler) {
//     // Handle specific errors
//     res.status(err.status).json({ error: err.code, message: err.message });
//   } else {
//     // Handle other errors as internal server errors
//     res.status(AuthErrorHandler.InternalServerError.status).json({
//       error: AuthErrorHandler.InternalServerError.code,
//       message: AuthErrorHandler.InternalServerError.message,
//     });
//   }
// };

export {
  ServerError,
  Conflict,
  Forbidden,
  Unauthorized,
  ResourceNotFound,
  BadRequest,
  InvalidInput,
  HttpError,
  routeNotFound,
  errorHandler,
};
