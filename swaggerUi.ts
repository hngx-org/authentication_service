import swaggerJSDoc from "swagger-jsdoc";
// NOT IN USE
const swaggerDefinition = {
  info: {
    title: "Node Swagger API",
    version: "1.0.0",
    description: "Demonstrating how to describe a RESTful API with Swagger",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/**/*.ts"],
};

export default swaggerJSDoc(options);
