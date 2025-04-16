import bcrypt from "bcryptjs";
import pool from "../config/db.js"; // Ensure correct path
import dotenv from "dotenv";

dotenv.config();

const seedSuperAdmin = async () => {
  const password = "123456"; // Change to a strong password
  const role = "superadmin";
  const tenantId = 1; // Default tenant

  try {
    // ✅ Check if Super Admin role already exists
    const [existingUser] = await pool.query("SELECT id FROM users WHERE role = ?", [role]);
    if (existingUser.length > 0) {
      console.log("✅ Super Admin already exists. Skipping seeding.");
      return;
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🚀 Insert Super Admin user
    await pool.query(
      "INSERT INTO users (fullName, email, password, role, tenant_id) VALUES (?, ?, ?, ?, ?)",
      ["Super Admin", "awais@greyloops.com", hashedPassword, role, tenantId]
    );

    console.log("✅ Super Admin seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding Super Admin:", error);
  }
};

export default seedSuperAdmin;
