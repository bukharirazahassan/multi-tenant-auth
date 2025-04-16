/**
 * @swagger
 * tags:
 *   name: Role Counts
 *   description: API for retrieving user counts based on roles
 */

/**
 * @swagger
 * /api/role-count:
 *   get:
 *     summary: Get user counts by role
 *     tags: [Role Counts]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves the number of users grouped by their roles from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved user role counts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 roleCounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       role:
 *                         type: string
 *                         example: "admin"
 *                       role_count:
 *                         type: integer
 *                         example: 5
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *       500:
 *         description: Internal Server Error.
 */
