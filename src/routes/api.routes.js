import express from 'express';
import { getAllAPIs, getAPIsByCategory } from '../controllers/api.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = express.Router();

// Route to fetch all APIs
/**
 * @swagger
 * /api/v1/apis:
 *   get:
 *     summary: Get all APIs
 *     description: Returns all APIs available. Optionally, limit the number of results.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of APIs to retrieve (optional)
 *     responses:
 *       200:
 *         description: A list of APIs.
 */
router.get('/', verifyJWT , getAllAPIs);

// Route to fetch APIs by category

/**
 * @swagger
 * /api/v1/apis/{category}:
 *   get:
 *     summary: Get APIs by category
 *     description: Returns APIs based on the specified category. Optionally, limit the number of results.
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: The category of APIs to fetch.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of APIs to retrieve (optional)
 *     responses:
 *       200:
 *         description: A list of APIs filtered by category.
 *       404:
 *         description: Category not found.
 */
router.get('/:category', verifyJWT ,  getAPIsByCategory);

export default router;