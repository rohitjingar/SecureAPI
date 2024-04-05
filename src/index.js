// Importing the Express app and database connection function
import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

// Loading environment variables from .env file
dotenv.config({
    path: './.env'
});

// Establishing connection to the database
connectDB()
    .then(() => {
        // Starting the Express server
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        // Handling database connection failure
        console.log("MongoDB connection failed:", error);
    });