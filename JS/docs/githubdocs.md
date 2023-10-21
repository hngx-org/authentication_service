# GitHub OAuth2 Authentication API Documentation

This API provides endpoints for GitHub OAuth2 Authentication, allowing users to authenticate using their GitHub accounts.

## Table of Contents

- [Authentication Flow](#authentication-flow)
- [Endpoints](#endpoints)
  - [Initiate GitHub Authentication](#initiate-github-authentication)
  - [GitHub Authentication Callback](#github-authentication-callback)
- [Responses](#responses)
- [Error Handling](#error-handling)

## Authentication Flow

1. Users initiate the GitHub OAuth2 Authentication process by accessing the `/api/auth/github` endpoint.
2. They are redirected to GitHub for authentication.
3. After successful authentication, GitHub redirects them back to the `/api/auth/github/redirect` endpoint.
4. The server handles the GitHub callback and issues a JWT token to the user if authentication is successful.
5. The user can use the JWT token for further API requests.

## Endpoints

### Initiate GitHub Authentication

- **URL:** `/api/auth/github`
- **Method:** `GET`
- **Description:** Initiates GitHub OAuth2 Authentication by redirecting the user to GitHub.

### GitHub Authentication Callback

- **URL:** `/api/auth/github/redirect`
- **Method:** `GET`
- **Description:** Handles the callback from GitHub after authentication.

## Responses

- Successful GitHub Authentication (Status Code: 200)
  - After successful authentication, the server responds with a JWT token that can be used for further API requests.

- Authentication Failure (Status Code: 401)
  - If authentication fails, the server responds with a 401 status code.
## Sample Response
```json
{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTY5MzE4OTYsImV4cCI6MTY5NzAxODI5Nn0.3hKjzqJCTgUhs9-HGCxhbVH5QWNO41C6ELEwL3RD1SY"
}
```
## Error Handling

- Internal Server Error (Status Code: 500)
  - In case of an internal server error, the server responds with a 500 status code.


