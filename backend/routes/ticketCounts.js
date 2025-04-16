import express from "express";
import pool from "../config/db.js"; // Database connection
import dotenv from "dotenv";
import { authenticateToken } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// ✅ Get total ticket counts
router.get("/ticket-counts", authenticateToken, async (req, res) => {
  try {
    const query = "SELECT COUNT(*) AS totalTickets FROM support_tickets";
    const [rows] = await pool.query(query);

    res.json({ success: true, totalTickets: rows[0].totalTickets });
  } catch (error) {
    console.error("❌ Error fetching total ticket counts:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ Get ticket counts based on priority (for Pie Chart)
router.get("/ticket-pichart-counts", authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        current_priority Priority, 
        COUNT(*) AS ticketCount
      FROM support_tickets
      GROUP BY current_priority
      ORDER BY 
        CASE 
          WHEN current_priority = 'Urgent' THEN 1
          WHEN current_priority = 'High' THEN 2
          WHEN current_priority = 'Medium' THEN 3
          WHEN current_priority = 'Low' THEN 4
          ELSE 5
        END;
    `;

    const [rows] = await pool.query(query);
    
    res.json({ success: true, priorityTicketCounts: rows });
  } catch (error) {
    console.error("❌ Error fetching priority ticket counts:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ Get ticket counts based on current_status (for Status Overview)
router.get("/ticket-status-counts", authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        SUM(current_status = 'Open') AS open,
        SUM(current_status = 'In Progress') AS in_progress,
        SUM(current_status = 'Resolved') AS resolved,
        SUM(current_status = 'Closed') AS closed,
        SUM(current_status = 'On Hold') AS on_hold,
        SUM(current_status = 'Assigned') AS assigned
      FROM support_tickets;
    `;

    const [rows] = await pool.query(query);

    res.json({
      success: true,
      statusCounts: rows[0], // Destructure the single result object
    });
  } catch (error) {
    console.error("❌ Error fetching ticket status counts:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ Get total external users count
router.get("/external-users-count", authenticateToken, async (req, res) => {
  try {
    const query = "SELECT COUNT(*) AS totalExternalUsers FROM external_users";
    const [rows] = await pool.query(query);

    res.json({ success: true, totalExternalUsers: rows[0].totalExternalUsers });
  } catch (error) {
    console.error("❌ Error fetching external users count:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;
