/**
 * @swagger
 * tags:
 *   name: External Users
 *   description: API for fetching and storing users from an external source
 */

/**
 * @swagger
 * /api/fetch-external-users:
 *   get:
 *     summary: Fetch users from an external API and store them in the database
 *     tags: [External Users]
 *     description: Fetches users from an external API, checks for duplicates, hashes passwords, and inserts them into the MySQL database.
 *     responses:
 *       200:
 *         description: Successfully inserted users from external API.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "✅ Successfully inserted 5 new users"
 *       400:
 *         description: Invalid data format received from external API.
 *       500:
 *         description: Internal Server Error while fetching or inserting users.
 */
