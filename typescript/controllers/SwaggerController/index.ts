import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../../swagger_output.json';

const { serve } = swaggerUi;
const setup = swaggerUi.setup(swaggerSpec);

export default {
  serve,
  setup,
};
