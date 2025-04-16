import express from "express";
import pool from "../config/db.js"; // Database connection
import dotenv from "dotenv";
import { authenticateToken } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

/**
 * ✅ Get Monthly Summary for Line Chart
 * Endpoint: GET /line-chart/monthly-summary
 */
router.get("/monthly-summary", authenticateToken, async (req, res) => {
  try {
    const query = `
      WITH RECURSIVE MonthSeries AS (
          SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 11 MONTH), '%Y-%m-01') AS month_start
          UNION ALL
          SELECT DATE_FORMAT(DATE_ADD(month_start, INTERVAL 1 MONTH), '%Y-%m-01')
          FROM MonthSeries
          WHERE month_start < DATE_FORMAT(CURDATE(), '%Y-%m-01')
      )
      SELECT 
          DATE_FORMAT(ms.month_start, '%b %Y') AS month_name, 
          COALESCE(COUNT(st.id), 0) AS total_tickets
      FROM MonthSeries ms
      LEFT JOIN support_tickets st 
          ON DATE_FORMAT(st.ticket_date, '%Y-%m') = DATE_FORMAT(ms.month_start, '%Y-%m')
      GROUP BY ms.month_start
      ORDER BY ms.month_start;
    `;

    const [rows] = await pool.query(query);
    res.json({ success: true, monthlySummary: rows });
  } catch (error) {
    console.error("❌ Error fetching Monthly Summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
