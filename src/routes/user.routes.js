import express from 'express';
import { 
    changeCurrentPassword,
    getCurrentUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser,
    updateAccountDetails
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route to register a new user
/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', registerUser);

// Route to log in a user
/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Log in user
 *     description: Logs in a user with the provided credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post('/login', loginUser);

// Route to log out a user
/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     summary: Log out user
 *     description: Logs out the currently authenticated user.
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', verifyJWT, logoutUser);

// Route to refresh access token
/**
 * @swagger
 * /api/v1/users/refresh-AccessToken:
 *   post:
 *     summary: Refresh access token
 *     description: Refreshes the access token for the authenticated user.
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 */
router.post('/refresh-AccessToken', refreshAccessToken);

// Route to change user password
/**
 * @swagger
 * /api/v1/users/change-password:
 *   post:
 *     summary: Change user password
 *     description: Changes the password for the authenticated user.
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 oldPassword:
 *                   type: string
 *                   description: The current password of the user.
 *                 newPassword:
 *                   type: string
 *                   description: The new password for the user.
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post('/change-password', verifyJWT, changeCurrentPassword);

// Route to get current user details
/**
 * @swagger
 * /api/v1/users/current-user:
 *   get:
 *     summary: Get current user details
 *     description: Retrieves details of the currently authenticated user.
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 */
router.get('/current-user', verifyJWT, getCurrentUser);

// Route to update user account details
/**
 * @swagger
 * /api/v1/users/update-account:
 *   patch:
 *     summary: Update user account details
 *     description: Updates account details of the currently authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The new email for the user
 *               fullName:
 *                 type: string
 *                 description: The new full name for the user
 *     responses:
 *       200:
 *         description: Account details updated successfully
 */
router.patch('/update-account', verifyJWT, updateAccountDetails);



export default router;
