/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     description: Fetch all users with id, fullName, email, tenant_id, role, and created_at.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       fullName:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       tenant_id:
 *                         type: integer
 *                         example: 1
 *                       role:
 *                         type: string
 *                         enum: [admin, user, superadmin]
 *                         example: "admin"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-02-26T12:00:00.000Z"
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update user role
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     description: Updates the role of a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: User role updated successfully.
 *       400:
 *         description: Invalid role provided.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/users/support-list:
 *   get:
 *     summary: Retrieve a list of support users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     description: Fetch all users who have the role "support", returning their ID and full name.
 *     responses:
 *       200:
 *         description: A list of support users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 supportUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       fullName:
 *                         type: string
 *                         example: "John Doe"
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */
