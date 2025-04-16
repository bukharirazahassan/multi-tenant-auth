/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard access route
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get user dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves the authenticated user's dashboard details (email and tenantId).
 *     responses:
 *       200:
 *         description: Successfully retrieved user dashboard data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     tenantId:
 *                       type: integer
 *                       example: 12345
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
