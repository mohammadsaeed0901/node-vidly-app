import swaggerJsdoc, { type Options } from "swagger-jsdoc";
require('dotenv').config();

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vidly App",
      version: "1.0.0",
      description: "API Documentation for Vidly App",
      contact: {
        name: "Mohammad saeed Kazemi",
        email: "mohammad.saeed.ka1378@gmail.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`, // Your server URL
      },
    ],
    components: {
        securitySchemes: {
            xAuthToken: { 
                type: "apiKey",
                in: "header",
                name: "x-auth-token",
            },
          },
        },
        security: [
          {
            xAuthToken: [],
          },
        ],
  },
  apis: ["./routes/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;