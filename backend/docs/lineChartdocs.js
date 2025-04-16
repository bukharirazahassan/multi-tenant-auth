/**
 * @swagger
 * tags:
 *   name: Ticket Counts
 *   description: API for retrieving support ticket counts over the last 7 days
 */

/**
 * @swagger
 * /api/tickets/line-chart-counts:
 *   get:
 *     summary: Get support ticket counts for the last 7 days
 *     tags: [Ticket Counts]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves the number of support tickets created each day for the last 7 days.
 *     responses:
 *       200:
 *         description: Successfully retrieved ticket counts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 ticketCounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ticket_date:
 *                         type: string
 *                         format: date
 *                         example: "2024-03-10"
 *                       total_tickets:
 *                         type: integer
 *                         example: 12
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *       500:
 *         description: Internal Server Error.
 */
