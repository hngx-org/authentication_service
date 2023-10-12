const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'AU API Documentation',
      version: '1.0.0',
      description: 'Documentation for your API',
    },
  },
  apis: ['./swaggerUi.js', './routes/getAuth.js'], // Specify the path to your API route files
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * @swagger
 * /api/sample:
 *   get:
 *     summary: Get a sample response
 *     responses:
 *       200:
 *         description: A sample response
 *   post:
 *     summary: Create a new sample
 *     requestBody:
 *       description: Sample data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the sample
 *               description:
 *                 type: string
 *                 description: Description of the sample
 *     responses:
 *       201:
 *         description: Sample created successfully
 *       400:
 *         description: Bad request, invalid input
 */

module.exports = swaggerSpec;
