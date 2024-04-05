// Importing mongoose for MongoDB connection and DB_NAME constant
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Function to establish connection to MongoDB
const connectDB = async () => {
    try {
        // Connecting to MongoDB using MONGODB_URI and DB_NAME
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        // Logging successful connection
        console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        // Handling MongoDB connection error
        console.error("MongoDB connection error:", error);
        // Exiting process on connection failure
        process.exit(1);
    }
};

export default connectDB; // Exporting the connectDB function