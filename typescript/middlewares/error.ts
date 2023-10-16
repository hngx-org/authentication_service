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

export {
  ServerError,
  Conflict,
  Forbidden,
  Unauthorized,
  ResourceNotFound,
  BadRequest,
  InvalidInput,
  HttpError,
};
