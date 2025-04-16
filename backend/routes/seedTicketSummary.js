import pool from "../config/db.js"; // Ensure correct path
import dotenv from "dotenv";

dotenv.config();

const seedTicketSummary = async () => {
  try {
    // ✅ Create the table if it does not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ticket_summary (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        is_selected BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);
    console.log("✅ Table 'ticket_summary' exists or created successfully.");

    // ✅ Check if data already exists
    const [existingRecords] = await pool.query("SELECT id FROM ticket_summary LIMIT 1;");

    if (existingRecords.length > 0) {
      console.log("✅ Ticket summary data already exists. Skipping seeding.");
      return;
    }

    // 🚀 Insert default records
    await pool.query(
      "INSERT INTO ticket_summary (name, is_selected) VALUES (?, ?), (?, ?), (?, ?)",
      ["Daily Trends", false, "Weekly Insights", false, "Monthly Summary", true]
    );

    console.log("✅ Ticket summary seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding ticket summary:", error);
  }
};

export default seedTicketSummary;
