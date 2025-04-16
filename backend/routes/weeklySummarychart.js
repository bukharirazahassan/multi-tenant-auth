import express from "express";
import pool from "../config/db.js"; // Database connection
import dotenv from "dotenv";
import { authenticateToken } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

/**
 * ✅ Get Weekly Summary for Bar Chart
 * Endpoint: GET /bar-chart/weekly-summary
 */
router.get("/weekly-summary", authenticateToken, async (req, res) => {
  try {
    const query = `
      WITH RECURSIVE WeekSeries AS (
          -- Start from the 1st day of the current month
          SELECT DATE_FORMAT(CURDATE(), '%Y-%m-01') AS week_start
          UNION ALL
          -- Generate exactly 4 weeks
          SELECT DATE_ADD(week_start, INTERVAL 7 DAY)
          FROM WeekSeries
          WHERE week_start < DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 21 DAY) 
      )
      SELECT 
          DATE_FORMAT(ws.week_start, '%Y-%m-%d') AS week_start_date,
          COALESCE(COUNT(st.id), 0) AS total_tickets
      FROM WeekSeries ws
      LEFT JOIN support_tickets st 
          ON st.ticket_date >= ws.week_start 
          AND st.ticket_date < DATE_ADD(ws.week_start, INTERVAL 7 DAY)  -- ✅ Include full week
      GROUP BY ws.week_start
      ORDER BY ws.week_start;
    `;

    const [rows] = await pool.query(query);
    res.json({ success: true, weeklySummary: rows });
  } catch (error) {
    console.error("❌ Error fetching Weekly Summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
