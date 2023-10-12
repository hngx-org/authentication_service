const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger_output.json");

const serve = swaggerUi.serve;
const setup = swaggerUi.setup(swaggerSpec);

const SwaggerController = {
  serve,
  setup,
};

module.exports = SwaggerController;
