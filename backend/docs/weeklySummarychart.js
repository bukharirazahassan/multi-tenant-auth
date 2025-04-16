/**
 * @swagger
 * tags:
 *   name: Weekly Summary
 *   description: API for retrieving support ticket counts for the last 4 weeks
 */

/**
 * @swagger
 * /api/weekly-chart/weekly-summary:
 *   get:
 *     summary: Get support ticket counts for the last 4 weeks
 *     tags: [Weekly Summary]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves the number of support tickets created each week for the current month.
 *     responses:
 *       200:
 *         description: Successfully retrieved weekly ticket counts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 weeklySummary:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       week_start_date:
 *                         type: string
 *                         format: date
 *                         example: "2025-03-01"
 *                       total_tickets:
 *                         type: integer
 *                         example: 20
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *       500:
 *         description: Internal Server Error.
 */
