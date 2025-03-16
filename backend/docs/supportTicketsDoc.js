
/**
 * @swagger
 * tags:
 *   name: Support Tickets
 *   description: API for managing support tickets
 */

/**
 * @swagger
 * /api/support-tickets:
 *   get:
 *     summary: Get all support tickets
 *     tags: [Support Tickets]
 *     description: Fetches all support tickets from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved support tickets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   ticket_number:
 *                     type: string
 *                     example: "TKT-123456"
 *                   user_id:
 *                     type: integer
 *                     example: 5
 *                   subject:
 *                     type: string
 *                     example: "Unable to access account"
 *                   description:
 *                     type: string
 *                     example: "User cannot log in due to password issues."
 *                   status:
 *                     type: string
 *                     enum: [Open, In Progress, Resolved, Closed, On Hold]
 *                     example: "Open"
 *                   priority:
 *                     type: string
 *                     enum: [Low, Medium, High, Urgent]
 *                     example: "High"
 *                   assigned_to:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-12T14:30:00Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-12T15:00:00Z"
 *                   closed_at:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: null
 *                   resolution:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *       500:
 *         description: Internal Server Error while fetching support tickets.
 */