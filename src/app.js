// Importing necessary modules
import express from "express";
import cors from "cors"; // For handling cross-origin requests
import cookieParser from "cookie-parser"; // For CRUD operations on user cookies
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

export default app; // Exporting Express app