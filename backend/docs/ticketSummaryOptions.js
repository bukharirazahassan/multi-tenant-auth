/**
 * @swagger
 * tags:
 *   name: Ticket Summary
 *   description: API for retrieving the selected ticket summary
 */

/**
 * @swagger
 * /api/monthly-summary/select-option:
 *   get:
 *     summary: Get selected ticket summary
 *     description: Retrieves the ticket summary where `is_selected` is 1.
 *     tags: [Ticket Summary]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved selected ticket summary.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     name:
 *                       type: string
 *                       example: "Monthly Summary"
 *                     is_selected:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized (Invalid or missing token).
 *       404:
 *         description: No selected records found.
 *       500:
 *         description: Internal Server Error.
 */


/**
 * @swagger
 * /api/monthly-summary/save-option:
 *   post:
 *     summary: Save selected ticket option
 *     description: Updates the `is_selected` field for a given ticket ID and resets all other selections.
 *     tags: [Ticket Summary]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Successfully updated the selected ticket option.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Selected option saved successfully."
 *       400:
 *         description: Bad request (missing or invalid ID).
 *       401:
 *         description: Unauthorized (Invalid or missing token).
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal Server Error.
 */