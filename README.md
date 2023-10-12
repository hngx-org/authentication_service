# Authentication Service

## Environment Variabls

Please ensure your environment variables are appropriately and clearly named.
Use the `.env.example` file as your starting point. Once in your local development environment, copy the `.env.example` file and rename it to `.env`


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
