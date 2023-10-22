import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../../swagger_output.json';
// NOT IN USE
const { serve } = swaggerUi;
const setup = swaggerUi.setup(swaggerSpec);

export default {
  serve,
  setup,
};
