import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  info: {
	title: 'Node Swagger API',
	version: '1.0.0',
	description: 'Demonstrating how to describe a RESTful API with Swagger',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

export default swaggerJSDoc(options);
