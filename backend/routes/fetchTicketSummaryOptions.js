import express from "express";
import pool from "../config/db.js"; // Database connection
import dotenv from "dotenv";
import { authenticateToken } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// ✅ Get total ticket counts
router.get("/select-option", authenticateToken, async (req, res) => {
  try {
    const query = "SELECT id, name, is_selected FROM ticket_summary WHERE is_selected = 1;";
    const [rows] = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "No selected records found." });
    }

    const selectedRecord = rows[0];

    res.json({
      success: true,
      data: {
        id: selectedRecord.id,
        name: selectedRecord.name,
        is_selected: selectedRecord.is_selected,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching total ticket counts:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ Save selected ticket option
router.post("/save-option", authenticateToken, async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required." });
  }

  try {
    // Reset all selections
    await pool.query("UPDATE ticket_summary SET is_selected = 0");

    // Set the selected option
    const updateQuery = "UPDATE ticket_summary SET is_selected = 1 WHERE id = ?";
    const [result] = await pool.query(updateQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Record not found." });
    }

    res.json({ success: true, message: "Selected option saved successfully." });
  } catch (error) {
    console.error("❌ Error saving selected option:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;
