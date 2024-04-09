// Importing necessary modules
import express from "express";
import swaggerUi from 'swagger-ui-express';
import cors from "cors"; // For handling cross-origin requests
import cookieParser from "cookie-parser"; // For CRUD operations on user cookies
import swaggerSpec from './config/swagger.js';
const app = express(); // Initializing Express app


// Handling cross-origin requests from frontend
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allowing specific origin
    credentials: true // Allowing credentials
}));

// Parsing JSON data
app.use(express.json({
    limit: "16kb" // Limiting JSON data size
}));

// Parsing URL-encoded data
app.use(express.urlencoded({
    extended: true, // Allowing extended format
    limit: "16kb" // Limiting URL data size
}));

// Accessing cookies in app or request
app.use(cookieParser());

// routes import
import userRouter from './routes/user.routes.js'
import apiRoutes from './routes/api.routes.js';


// routes declaration
app.use("/api/v1/users", userRouter)
app.use('/api/v1/apis', apiRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app; // Exporting Express app