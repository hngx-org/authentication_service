class HttpError extends Error {
  constructor(statusCode, message, errorCode) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

class BadRequest extends HttpError {
  constructor(message, errorCode) {
    super(400, message, errorCode);
  }
}

class ResourceNotFound extends HttpError {
  constructor(message, errorCode) {
    super(404, message, errorCode);
  }
}

class Unauthorized extends HttpError {
  constructor(message, errorCode) {
    super(401, message, errorCode);
  }
}

class Forbidden extends HttpError {
  constructor(message, errorCode) {
    super(403, message, errorCode);
  }
}
class Conflict extends HttpError {
  constructor(message, errorCode) {
    super(409, message, errorCode);
  }
}

class ServerError extends HttpError {
  constructor(message, errorCode) {
    super(500, message, errorCode);
  }
}

module.exports = {
  ServerError,
  Conflict,
  Forbidden,
  Unauthorized,
  ResourceNotFound,
  BadRequest,
  HttpError,
};
