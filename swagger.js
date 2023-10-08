const swaggerAutogen = require('swagger-autogen')()
const outputFile = './swagger_output.json'
const endpointsFiles = ['./index.js']

const doc = {

    info: {
        version: "1.0.0",
        title: "zuri portfolio authentication_service API",
        description: "Documentation for zuri portfolio authentication_service API."
    },
    servers: [
        {
          url: "http://localhost:4000",
          description: "Confirmed working well"
        }
      ],
    basePath: "/",
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        JWT: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            in: 'header',
        },
    },
    tags: [
        {
            "name": "Auth",
            "description": "Authentication Endpoints"
        },        
    ],
    definitions: {
        users: {
            id: "42e2a46a-e56f-4e4d-be0e-0675b7026f58",
            firstName: "John",
            lastName: "doe",
            email:"test@gmail.com",
            username:"johndoe",
            password_hash:"myPassword2021"
        },
    }

  };


  swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js')
})