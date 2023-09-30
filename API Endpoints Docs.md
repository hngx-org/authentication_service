# Authentication API Endpoints

# Status Codes
HTTP response codes are used to indicate general classes of success and error. 
## Success Code
| HTTP Status Quote | code | Description |
| 200 | Success | Successfully processed request. |
|201 | Created | User created successfully. |
## Error Codes
Error responses contain more detail about the error in the response body, in the "code" and "message" properties.
| HTTP Status Quote | code | message |
| 400 | Bad Request | The user sent an invalid request. |
| 401 | Unauthorized | The user failed to authenticate with the server. |
|404 | Page Not Found | The page was not found. |
| 403 | Access Denied | The user does not have permission to access the requested resource. |
| 500 | Internal Server Error | Error processing request from the server. |


# Objects

## User Object

The user object will have the following attributes 

| Property value | Updatable | Type | Description | Example Value |
|---| ------ |---|---|---|
| id | Display-only | string (UUID) | Unique identifier for this user. | "e79a0b74-3aba-0bb6ee6" |
| email | Editable | string | The email address associated with the user's account. | "johndoe@dev.com" |
| firstName | Display-only | string | User's First Name, as typed during registration. | "John"|
| lastName | Display-only | string | User's Last Name, as typed during registration. | "Doe" |
| passwordHash | Editable | string | A securely hashed version of the user's password. | "F/m8DgjRu2xH7G.3QGKgY9"|
| registrationDate | Display-only | date | A timestamp indicating when the user account was created. | 2023-09-12T02:12:33.231Z |
| verificationStatus| Editable | string (Enum) | A field to track whether the user's email has been verified. | "Verified" or "Not Verified"                     |
| accessToken | Editable | string | Access token generated during the login process. |"eyJhbGcikpXVCJ9"|




# Endpoints

[Endpoints](csv/Endpoints.csv)

|  | Name | Type | URL | Description |
| --- | --- | --- | --- | --- |
| 1 | User SignUp | POST | https://zuriportfoloio.com/api/auth/signup | Handles user registration and sign-up processes. |
| 2 | LogIn With Email & Password | POST | https://zuriportfoloio.com/api/auth/login | Facilitates user authentication and login using the provided email and password credentials of a user. |
| 3 | LogIn With Facebook | POST | https://zuriportfoloio.com/api/auth/facebook | Facilitates user authentication and login using Facebook's OAuth (Open Authorization) authentication system. This endpoint allows users to log in by using their Facebook account credentials. |
| 4 | LogIn With GitHub | POST | https://zuriportfoloio.com/api/auth/github | Facilitates user authentication and login using GitHub's OAuth (Open Authorization) authentication system. This endpoint allows users to log in by using their GitHub account credentials. |
| 5 | LogIn With Google | POST | https://zuriportfoloio.com/api/auth/google | Facilitates user authentication and login using Google's OAuth (Open Authorization) authentication system. This endpoint allows users to log in by using their Google account credentials. |
| 6 | Send Verification Email | POST | https://zuriportfoloio.com/api/verify-email | Handles the verification and confirmation of the authenticity of a user's email address. |
| 7 | LogIn 2FA Authentication | POST | https://zuriportfoloio.com/api/auth/2fa-auth | Facilitates Two-Factor Authentication (2FA) for user authentication using user’s email and a time-based one time passcode. |
| 8 | Confirm 2FA Authentication | POST | https://zuriportfoloio.com/api/auth/confirm-2fa | Confirms the Two-Factor Authentication (2FA) sent to the user |
| 9 | Forgot Password | PATCH | https://zuriportfoloio.com/api/auth/forgot-password | Handles the process of resetting a user's forgotten password. |
| 10 | LogOut | POST | https://zuriportfoloio.com/api/auth/logout | Allows users to log out or terminate their current session. |


### User Signup

#### Sending Request

This cURL command performs a POST request to the specified URL with the given headers and JSON data payload, which includes the **`grant_type`** parameter.

```json
curl -X POST 'https://zuriportfoloio.com/api/auth/signup' \
-H 'Content-Type: application/json' \
-d '{
	"firstName": "John",
	"lastName": "Doe",
	"email": "johndoe@email.com",
	"password": "password123"
}'
```

### User Login with email

#### Sending Request

```json
# Request Body for User Login with Email
request_body='{
  "email": "johndoe@email.com",
  "password": "password123"
}'

# cURL Request for User Login with Email
curl -X POST 'https://zuriportfoloio.com/api/auth/login' \
-H 'Content-Type: application/json' \
-d "$request_body"
```

### User Login with email

#### Sending Request

```json
# Request Body for User Login with Email
request_body='{
  "email": "johndoe@email.com",
  "password": "password123"
}'

# cURL Request for User Login with Email
curl -X POST 'https://zuriportfoloio.com/api/auth/login' \
-H 'Content-Type: application/json' \
-d "$request_body"
```

### **Two-Factor Authentication (2FA)**

#### Sending Request

```json
# Request Body for Two-Factor Authentication (2FA)
request_body='{
  "otp": "123456"
}'

# cURL Request for Two-Factor Authentication (2FA)
curl -X POST 'https://zuriportfoloio.com/api/auth/2fa-login' \
-H 'Content-Type: application/json' \
-d "$request_body"
```

### Sign in with Facebook

#### Sending Request

```json
# Request Body for Sign in with Facebook
request_body='{
  "facebookToken": "facebook-auth-token"
}'

# cURL Request for Sign in with Facebook
curl -X POST 'https://zuriportfoloio.com/api/auth/facebook' \
-H 'Content-Type: application/json' \
-d "$request_body"
```

### Sign in with Github

#### Sending Request

```json
# Request Body for Sign in with Github
request_body='{
  "githubToken": "github-auth-token"
}'

# cURL Request for Sign in with Github
curl -X POST 'https://api.example.com/github-signin' \
-H 'Content-Type: application/json' \
-d "$request_body"
```