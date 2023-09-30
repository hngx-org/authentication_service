
# Objects

## User Object

The user object will have the following attributes 

| Property          | Updatable   | Type          | Description                                        | Example Value                                         |
| ----------------- | ----------- | ------------- | -------------------------------------------------- | ----------------------------------------------------- |
| id                | Display-only| string (UUID) | Unique identifier for this user.                   | "e79a0b74-3aba-4149-9f74-
0bb5791a6ee6"              |
| email             | Editable    | string        | The email address associated with the user's account. | "johndoe@dev.com"                                    |
| firstName         | Display-only| string        | User's First Name, as typed during registration.    | "John"                                                |
| lastName          | Display-only| string        | User's Last Name, as typed during registration.     | "Doe"                                                 |
| passwordHash      | Editable    | string        | A securely hashed version of the user's password.   | "$2a$12$z3I8f7eF/m8DgjRu2xH7G.3QGKgY9
b4QPC3fqqzTQrso/rU6EbwZa" |
| registrationDate  | Display-only| date          | A timestamp indicating when the user account was created. | 2023-09-12T02:12:33.231Z                           |
| verificationStatus| Editable    | string (Enum) | A field to track whether the user's email has been verified. | "Verified" or "Not Verified"                     |
| accessToken       | Editable    | string        | Access token generated during the login process.    | "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4g
RG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.-2F2RksP3Q5fHq
7H1YlZO8tNY0IzHdUbR1MCvF1GqQw" |

# Authentication API Endpoints


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

