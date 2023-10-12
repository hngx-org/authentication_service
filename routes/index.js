const { Router } = require('express');

// Swagger UI
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger_output.json");

const router = Router();

// Serve Swagger UI
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
