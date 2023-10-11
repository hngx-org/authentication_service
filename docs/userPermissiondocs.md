# User Permissions API

## Description

API for managing user permissions.

## API Endpoints

### Add Permission to User

- **URL:** `/api/users/addPermission`
- **Method:** POST
- **Description:** Add a permission to a user.

#### Request Body

- Content Type: `application/json`
- Structure:
  - `userId` (string): User ID.
  - `permissionId` (integer): Permission ID.

#### Responses

- `200 OK`: Permission added successfully.
- `400 Bad Request`: Check the request format.
- `404 Not Found`: User or permission not found.
- `500 Internal Server Error`.

### Remove Permission from User

- **URL:** `/api/users/removePermission`
- **Method:** DELETE
- **Description:** Remove a permission from a user.

#### Request Body

- Content Type: `application/json`
- Structure:
  - `userId` (string): User ID.
  - `permissionId` (integer): Permission ID.

#### Responses

- `200 OK`: Permission removed successfully.
- `400 Bad Request`: Check the request format.
- `404 Not Found`: User or permission not found.
- `500 Internal Server Error`
