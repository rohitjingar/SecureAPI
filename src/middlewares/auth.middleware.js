// Importing necessary modules and utilities
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware function to verify JWT access token
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Extracting JWT token from cookies or headers
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // Validating presence of token
        if (!token) {
            throw new ApiError(401, "Unauthorized request, Please sign up or log in. ");
        }

        // Verifying JWT token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Finding user by decoded token ID
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // Handling invalid token error
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Storing user in request object
        req.user = user;
        next();
    } catch (error) {
        // Handling token verification failure
        throw new ApiError(401, error?.message || "Invalid access Token");
    }
});
