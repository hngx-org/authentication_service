const express = require('express');
const {
  getAuth,
  getAuthPermissions,
  sendPermissionsAndRows,
} = require('../controllers/getAuth');
const router = express.Router();

/**
 * @swagger
 * /api/get-auth:
 *  post:
 *      summary: checks if a token is valid or user is authenticated get a list of possible role and users for user in /api/roles-and-permissions
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      token:
 *                          type: string
 *                          description: User authentication token
 *                      role:
 *                          type: string
 *                          description: User role for authorization (optional)
 *                      permission:
 *                          type: string
 *                          description: User permission for authorization (optional)
 *              example:
 *                  token: token_provided
 *                  role: role_to_check
 *                  permission: permission_to_check
 *      parameters:
 *       - in: body
 *         name: token
 *         required: false
 *         description: token to validate (if absent, user is unauthenticated)
 *         type: string
 *         example:
 *              token: token_provided
 *       - in: body
 *         name: role
 *         required: false
 *         description: Role to check for (optional)
 *         type: string
 *         example:
 *              token: token_provided
 *              role: role_to_check_for
 *       - in: body
 *         name: permission
 *         required: false
 *         description: Permission to check for (optional)
 *         type: string
 *         example:
 *              token: token_provided
 *              permission: permission_to_check_for
 *      responses:
 *          'authenticated':
 *              description: Successful authentication
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: integer
 *                          description: status of action
 *                      id:
 *                          type: string
 *                          description: id of user
 *                  example:
 *                      status: 200
 *                      id: user_id
 *          'Authorised':
 *              description: Successful authentication and authorization
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: integer
 *                          description: status of action
 *                      msg:
 *                          type: string
 *                          description: meesage of authorisation
 *                      id:
 *                          type: string
 *                          description: id of user
 *                  example:
 *                      status: 200
 *                      msg: authorized
 *                      id: user_id
 *          'unuthorised':
 *              description: Unauthorized or failed authentication
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: integer
 *                          description: status of action
 *                      msg:
 *                          type: string
 *                          description: meesage of authorisation
 *                      id:
 *                          type: string
 *                          description: id of user
 *                  example:
 *                      status: 401
 *                      msg: unauthorized
 */

/**
 * @swagger
 * /api/get-auth/permissions:
 *  post:
 *      summary: checks if a token is valid and returns all permissions of the user
 *      requestBody:
 *          required: false
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          token:
 *                          type: string
 *      responses:
 *          'Success':
 *              description: Successful authentication
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: integer
 *                          description: status of action
 *                      availablePermissions:
 *                          type: array
 *                          items:
 *                              type: string
 *                          description: List of user permissions.
 *                  example:
 *                      status: 200
 *                      availablePermissions:
 *                          - permission_1
 *                          - permission_2
 *          'not authenticated':
 *              description: Unauthorized
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: integer
 *                          description: status of action
 *                      msg:
 *                          type: string
 *                          description: meesage of authorisation
 *                      id:
 *                          type: string
 *                          description: id of user
 *                  example:
 *                      status: 401
 *                      msg: unauthorized
 */

router.post('/', getAuth);
router.post('/permissions', getAuthPermissions);
router.get('/roles-and-permissions', sendPermissionsAndRows);

module.exports = router;
