/* eslint-disable no-unused-vars */
const { HttpError } = require("../errors/httpErrorCodes");

function errorLogger(err, req, res, next) {
  if (err instanceof HttpError === false) console.log(err.message);
  next(err);
}

function errorHandler(err, req, res, next) {
  const isInvalidJSON =
    err instanceof SyntaxError &&
    "body" in err &&
    err.message.toLowerCase().includes("json");

  if (isInvalidJSON) {
    return res.error(400, err.message, "INVALID_JSON_FORMAT");
  }

  if (err instanceof HttpError) {
    return res.error(err.statusCode, err.message, err.errorCode);
  }

  res.error(500, "An unexpected error occured.", "UNEXPECTED_ERROR");
}

module.exports = { errorHandler, errorLogger };
