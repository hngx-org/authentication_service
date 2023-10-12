# Authentication Service

## Live Endpoint at https://auth.akuya.tech/

### Task:
Develop an authentication microservice for the zuri project.
### Objective
 Build an authentication microservice that is capable of:
 - User registration and login using local strategy, facebook, github and google authentication.
 - Two factor authentication.
 - User authorization using roles and permissions.

## Project Setup
#### Clone the repository 
```
git clone https://github.com/hngx-org/authentication_service
```
### Environment Variables

Please ensure your environment variables are appropriately and clearly named.
Use the `.env.example` file as your starting point. Once in your local development environment, copy the `.env.example` file and rename it to `.env`

#### Install all dependencies
```
pnpm install
```
## Run Project
```
node index.js
```

## Routes

The routes of the microservice can be accessed at http://auth.akuya.tech/api-docs/

# Error Handler Middleware

To use the errorhandler middleware, follow this example:

```
if(!email || !password){
  throw new BadRequest(error.message, INVALID_REQUEST_PARAMETERS);
}
```
## in this example:
- Replace the BadRequest with the right error, look at the imported error for the error that best suite what you want 
to throw.
- Replace the error.message with your defaown error meesage as a string or leave it that way
- INAVLID_REQUEST_PARAMETER can be replaced with the right error code, check the error folder for details 
