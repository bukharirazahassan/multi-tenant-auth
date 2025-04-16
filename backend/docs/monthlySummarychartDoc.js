/**
 * @swagger
 * tags:
 *   name: Monthly Summary
 *   description: API for retrieving support ticket counts over the last 12 months
 */

/**
 * @swagger
 * /api/monthly-chart/monthly-summary:
 *   get:
 *     summary: Get support ticket counts for the last 12 months
 *     tags: [Monthly Summary]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves the number of support tickets created each month for the last 12 months.
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
 *                 monthlySummary:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month_name:
 *                         type: string
 *                         example: "Apr 2024"
 *                       total_tickets:
 *                         type: integer
 *                         example: 10
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *       500:
 *         description: Internal Server Error.
 */