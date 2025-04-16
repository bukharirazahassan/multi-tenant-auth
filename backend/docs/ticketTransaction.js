/**
 * @swagger
 * tags:
 *   name: Ticket Transactions
 *   description: API for managing ticket transactions
 */

/**
 * @swagger
 * /api/transaction/addTransaction:
 *   post:
 *     summary: Add a new ticket transaction
 *     tags: [Ticket Transactions]
 *     security:
 *       - BearerAuth: []
 *     description: Create a new transaction for a support ticket.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_number:
 *                 type: string
 *                 example: "TKT12345"
 *               external_user_id:
 *                 type: integer
 *                 example: 1001
 *               assigned_by:
 *                 type: integer
 *                 example: 2001
 *               assigned_to:
 *                 type: integer
 *                 example: 3001
 *               ticket_status:
 *                 type: string
 *                 example: "Assigned"
 *               comment:
 *                 type: string
 *                 example: "Assigned to Support Team"
 *               priority:
 *                 type: string
 *                 example: "Urgent"
 *     responses:
 *       201:
 *         description: Successfully added ticket transaction.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket transaction added successfully"
 *                 transactionId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/transaction/ticketTransaction:
 *   get:
 *     summary: Get ticket transactions by ticket number
 *     tags: [Ticket Transactions]
 *     security:
 *       - BearerAuth: []
 *     description: Fetch all transactions related to a specific ticket, including external user details and assigned user information.
 *     parameters:
 *       - in: query
 *         name: ticket_number
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique ticket number to filter transactions.
 *     responses:
 *       200:
 *         description: Successfully retrieved ticket transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   transactionId:
 *                     type: integer
 *                     example: 1
 *                   ticket_number:
 *                     type: string
 *                     example: "TKT12345"
 *                   external_user_id:
 *                     type: integer
 *                     example: 1001
 *                   external_user_name:
 *                     type: string
 *                     example: "John Doe"
 *                   external_user_email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   assigned_by:
 *                     type: integer
 *                     example: 2001
 *                   assigned_by_name:
 *                     type: string
 *                     example: "Alice Smith"
 *                   assigned_to:
 *                     type: integer
 *                     example: 3001
 *                   ticket_status:
 *                     type: string
 *                     example: "Assigned"
 *                   comment:
 *                     type: string
 *                     example: "Assigned to Support Team"
 *                   priority:
 *                     type: string
 *                     example: "Urgent"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-28T12:34:56Z"
 *       400:
 *         description: Ticket number is required.
 *       404:
 *         description: Ticket transaction not found.
 *       500:
 *         description: Internal Server Error.
 */
