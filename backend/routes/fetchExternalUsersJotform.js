import express from "express";
import db from "../config/db.js"; // Import database connection
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to fetch all external users from JotForm
router.get("/", async (req, res) => {
    try {
        const [users] = await db.execute("SELECT * FROM external_users");
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching external users:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
