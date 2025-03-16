/**
 * @swagger
 * tags:
 *   name: External Users
 *   description: API for fetching external users from JotForm
 */

/**
 * @swagger
 * /api/fetch-external-users-Jotform:
 *   get:
 *     summary: Fetch all external users
 *     tags: [External Users]
 *     description: Retrieves all external users stored in the database from JotForm.
 *     responses:
 *       200:
 *         description: Successfully retrieved external users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "john.doe@example.com"
 *                   work_phone:
 *                     type: string
 *                     example: "+1234567890"
 *                   addr_line1:
 *                     type: string
 *                     example: "123 Main St"
 *                   addr_line2:
 *                     type: string
 *                     nullable: true
 *                     example: "Apt 4B"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   state:
 *                     type: string
 *                     example: "NY"
 *                   postal:
 *                     type: string
 *                     example: "10001"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-12T14:30:00Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-12T15:00:00Z"
 *       500:
 *         description: Internal Server Error while fetching external users.
 */