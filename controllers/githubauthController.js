const {
  ResourceNotFound,
  Unauthorized,
  BadRequest,
  Conflict,
  Forbidden,
  ServerError,
} = require("../errors/httpErrors");
const {
  RESOURCE_NOT_FOUND,
  ACCESS_DENIED,
  INVALID_TOKEN,
  MISSING_REQUIRED_FIELD,
  INVALID_REQUEST_PARAMETERS,
  EXISTING_USER_EMAIL,
  EXPIRED_TOKEN,
  CONFLICT_ERROR_CODE,
  THIRD_PARTY_API_FAILURE,
} = require("../errors/httpErrorCodes");
const handleGithubAUth = (req,res) => {
        // Successful GitHub authentication, generate a JWT token
        const token = req.user;
        if (token) {
          // Redirect to a client page with the token or send it as a JSON response
          res.json({ token });
        } else {
          // Handle authentication failure
          res.status(401).json({ message: "Authentication failed" });
        }

}

module.exports = handleGithubAUth;
