import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Registration Route
router.post("/register", async (req, res) => {
  const { fullName, email, password, tenantId = 1, role = "user" } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user already exists
    const [existingUser] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const [result] = await pool.query(
      "INSERT INTO users (fullName, email, password, tenant_id, role) VALUES (?, ?, ?, ?, ?)",
      [fullName, email, hashedPassword, tenantId, role]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: "User registration failed" });
    }

    // Generate JWT token (only with user ID)
    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "Registration successful!", token });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token (only with user ID)
    const token = jwt.sign({ id: user.id, role: user.role, fullName: user.fullName, tenantId: user.tenant_id },process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Export router
export default router;
