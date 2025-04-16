import express from "express";
import pool from "../config/db.js"; // Database connection
import dotenv from "dotenv";
import { authenticateToken } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

/**
 * ✅ Get User Counts by Role
 * Endpoint: GET /users/role-count
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Query to count users by role
    const query = "SELECT role, COUNT(*) AS role_count FROM users GROUP BY role";
    const [rows] = await pool.query(query);

    res.json({ success: true, roleCounts: rows });
  } catch (error) {
    console.error("❌ Error fetching role counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/line-chart-counts", authenticateToken, async (req, res) => {
  try {
    const query = `
      WITH RECURSIVE DateSeries AS (
    SELECT CURDATE() - INTERVAL 6 DAY AS ticket_date
    UNION ALL
    SELECT ticket_date + INTERVAL 1 DAY 
    FROM DateSeries 
    WHERE ticket_date < CURDATE()
)
SELECT 
    DATE_FORMAT(ds.ticket_date, '%Y-%m-%d') AS ticket_date,  -- ✅ Fix date format
    COALESCE(COUNT(st.id), 0) AS total_tickets
FROM DateSeries ds
LEFT JOIN support_tickets st 
    ON DATE(st.ticket_date) = ds.ticket_date
WHERE ds.ticket_date BETWEEN CURDATE() - INTERVAL 6 DAY AND CURDATE()
GROUP BY ds.ticket_date
ORDER BY ds.ticket_date;
    `;

    const [rows] = await pool.query(query);
    res.json({ success: true, ticketCounts: rows });
  } catch (error) {
    console.error("❌ Error fetching ticket counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
