/**
 * @swagger
 * /api/fetch-tickets/ticket-counts:
 *   get:
 *     summary: Get total ticket count
 *     description: Fetches the total number of tickets from the `support_tickets` table.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Tickets
 *     responses:
 *       200:
 *         description: Successfully fetched the total ticket count.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalTickets:
 *                   type: integer
 *                   example: 50
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /api/fetch-tickets/ticket-pichart-counts:
 *   get:
 *     summary: Get ticket count by priority
 *     description: Fetches the count of tickets grouped by priority (Urgent, High, Medium, Low).
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Tickets
 *     responses:
 *       200:
 *         description: Successfully fetched ticket count by priority.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 priorityTicketCounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Priority:
 *                         type: string
 *                         example: "High"
 *                       ticketCount:
 *                         type: integer
 *                         example: 20
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

