/* eslint-disable no-unused-vars */
const { HttpError } = require('../errors/httpErrors');

function errorLogger(err, req, res, next) {
  if (err && err.oauthError) {
    return res.status(err.status).json(err);
  }
  next(err);
}

function errorHandler(err, req, res, next) {
  const isInvalidJSON =
    err instanceof SyntaxError &&
    'body' in err &&
    err.message.toLowerCase().includes('json');

  if (isInvalidJSON) {
    return res
      .status(400)
      .json({ error: err.message, errorCode: 'INVALID_JSON_FORMAT' });
  }

  if (err instanceof HttpError) {
    return res
      .status(err.statusCode)
      .json({ status: 'Error', code: err.errorCode, message: err.message });
  }
  res.status(500).json({
    error: 'An unexpected error occurred',
    errorCode: 'UNEXPECTED_ERROR',
  });
}

module.exports = { errorHandler, errorLogger };
