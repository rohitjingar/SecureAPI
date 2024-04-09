import { fileURLToPath } from 'url';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Your API Documentation',
    version: '1.0.0',
    description: 'Documentation for your APIs',
  },
  
};

const apisDir = path.join(__dirname, '..', 'routes');

const options = {
  swaggerDefinition,
  apis: [apisDir + '/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;