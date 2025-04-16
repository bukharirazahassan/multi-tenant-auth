/**
 * @swagger
 * tags:
 *   name: Support Tickets
 *   description: Support ticket management
 */

/**
 * @swagger
 * /api/ticketDetail/ticketNumber:
 *   get:
 *     summary: Fetch a support ticket by ticket number
 *     tags: [Support Tickets]
 *     description: Retrieve a specific support ticket along with user details using the ticket number.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ticketNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique ticket number
 *     responses:
 *       200:
 *         description: Ticket details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticket_id:
 *                   type: integer
 *                   example: 101
 *                 ticket_number:
 *                   type: string
 *                   example: "TICKET-20240312-001"
 *                 subject:
 *                   type: string
 *                   example: "Login issue"
 *                 description:
 *                   type: string
 *                   example: "User cannot log in to the dashboard."
 *                 status:
 *                   type: string
 *                   example: "Open"
 *                 priority:
 *                   type: string
 *                   example: "High"
 *                 ticket_created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-12T10:15:30Z"
 *                 ticket_email:
 *                   type: string
 *                   example: "user@example.com"
 *                 user_name:
 *                   type: string
 *                   example: "John Doe"
 *                 user_email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *       400:
 *         description: Bad request, missing ticket number
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
