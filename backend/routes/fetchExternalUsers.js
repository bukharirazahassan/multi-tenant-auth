import express from "express";
import pool from "../config/db.js"; // Database connection
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import fetch from "node-fetch"; // Ensure you have this for API requests

dotenv.config();

const router = express.Router();

// Fetch users from external API and store them in MySQL
router.get("/", async (req, res) => {
  try {
    console.log("🔄 Fetching users from external API...");
    
    const response = await fetch(process.env.EXTERNAL_API_URL);

    if (!response.ok) {
      throw new Error(`External API error: ${response.status} ${response.statusText}`);
    }

    const users = await response.json();

    if (!Array.isArray(users)) {
      return res.status(400).json({ error: "Invalid user data format from external API" });
    }

    let insertedCount = 0;

    for (const user of users) {
      try {
        const { fullName, email, password, tenant_id = null, role = "user" } = user;

        // Check if email already exists
        const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
          console.log(`⚠️ User with email ${email} already exists. Skipping.`);
          continue;
        }

        // Hash password before inserting
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user with `NULL` tenant_id
        await pool.query(
          "INSERT INTO users (fullName, email, password, tenant_id, role) VALUES (?, ?, ?, ?, ?)",
          [fullName, email, hashedPassword, tenant_id, role]
        );

        insertedCount++;
      } catch (err) {
        console.error(`❌ Error inserting user ${user.email}:`, err.message);
      }
    }

    res.json({ message: `✅ Successfully inserted ${insertedCount} new users` });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

export default router;
