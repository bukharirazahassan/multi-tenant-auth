import express from "express";
import pool from "../config/db.js"; // Database connection
import dotenv from "dotenv";
import { authenticateToken } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// ✅ Get All Users with Role-Based Filtering
router.get("/", authenticateToken, async (req, res) => {
  try {
    
    let query = "";
    
    if (req.user.role === "superadmin") {
      // Super Admin can see all roles
      query = "SELECT id, fullName, email, tenant_id, role, created_at FROM users WHERE role IN ('user', 'admin', 'staff', 'support')";
    } else if (req.user.role === "admin") {
      // Admin can manage 'user', 'staff', 'support'
      query = "SELECT id, fullName, email, tenant_id, role, created_at FROM users WHERE role IN ('user', 'staff', 'support')";
    } else {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const [rows] = await pool.query(query);
    res.json({ success: true, users: rows });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update User Role (PATCH)
router.patch("/:id", authenticateToken, async (req, res) => {
  let { id } = req.params;
  const { role } = req.body;

  // Ensure `id` is treated as an integer
  id = parseInt(id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  // ✅ Allow all valid roles
  const allowedRoles = ["admin", "user", "staff", "support"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role. Allowed values: admin, user, staff, support" });
  }

  try {
    const [result] = await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: `User role updated successfully to '${role}'` });
  } catch (error) {
    console.error("❌ Error updating user role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get Support Users
router.get("/support-list", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, fullName FROM users where role in ('support')");
    res.json({ success: true, supportUsers: rows });
  } catch (error) {
    console.error("❌ Error fetching support users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Export router
export default router;
