// Importing necessary modules and utilities
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// Function to generate access and refresh tokens for a user
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
};

// Route handler to register a new user
const registerUser = asyncHandler(async (req, res) => {
    // Extracting required fields from request body
    const { username, fullName, email, password } = req.body;

    // Validating required fields
    if (username === "") {
        throw new ApiError(400, "Username is required");
    } else if (fullName === "") {
        throw new ApiError(400, "Fullname is required");
    } else if (email === "") {
        throw new ApiError(400, "Email is required");
    } else if (password === "") {
        throw new ApiError(400, "Password is required");
    }

    // Checking if user with the same username or email already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    // Creating new user
    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase()
    });

    // Fetching created user details
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // Handling registration success response
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// Route handler to log in a user
const loginUser = asyncHandler(async (req, res) => {
    // Extracting username/email and password from request body
    const { email, username, password } = req.body;

    // Validating required fields
    if (!username || !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // Finding user by username or email
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    // Handling user not found error
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Checking if password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);

    // Handling invalid password error
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generating access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Fetching logged-in user details
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Configuring cookie options
    const options = {
        httpOnly: true,
        secure: true
    };

    // Handling login success response with cookies
    return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        ));
});

// Route handler to log out a user
const logoutUser = asyncHandler(async (req, res) => {
    // Removing refresh token from the user document
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    // Configuring cookie options
    const options = {
        httpOnly: true,
        secure: true
    };

    // Handling logout success response by clearing cookies
    return res.status(200).clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

// Route handler to refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Extracting refresh token from cookies or request body
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    // Validating presence of refresh token
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        // Verifying the incoming refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Finding user by decoded token ID
        const user = await User.findById(decodedToken?._id);

        // Handling invalid refresh token error
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // Validating incoming refresh token against stored refresh token
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // Configuring cookie options
        const options = {
            httpOnly: true,
            secure: true
        };

        // Generating new access and refresh tokens
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        // Handling access token refresh success response with new tokens
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed successfully"
            ));
    } catch (error) {
        // Handling token verification failure
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// Route handler to change user password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    // Extracting old and new password from request body
    const { oldPassword, newPassword } = req.body;
    if(!oldPassword || !newPassword){
         throw new ApiError(400, "Both Password are required")
    }
    // Finding user by ID
    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(500,"Cuurent User Not found")
    }
    // Checking if old password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    // Handling incorrect old password error
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    // Setting new password and saving user
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    // Handling password change success response
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Route handler to fetch current user details
const getCurrentUser = asyncHandler(async (req, res) => {
    // Returning current user details
    if(!req.user){
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// Route handler to update user account details
const updateAccountDetails = asyncHandler(async (req, res) => {
    // Extracting email and fullName from request body
    const { email, fullName } = req.body;

    // Validating required fields
    if (!email || !fullName) {
        throw new ApiError(400, "Both email and fullName are required");
    }

    // Finding user by ID and updating account details
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {
            new: true // Return the updated document
        }
    ).select("-password"); // Exclude password field from the result

    // Handling user not found error
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Handling account details update success response
    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});


// Exporting route handlers
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
};
