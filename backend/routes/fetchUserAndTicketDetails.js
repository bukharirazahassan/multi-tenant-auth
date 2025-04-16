import express from "express";
import db from "../config/db.js"; // Import database connection
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to fetch support tickets by ticket number
router.get("/ticketNumber", authenticateToken, async (req, res) => {
    const { ticketNumber } = req.query; // ✅ Corrected from req.params to req.query

    if (!ticketNumber) {
        return res.status(400).json({ error: "Ticket number is required" });
    }

    try {
        const [tickets] = await db.execute(
            `SELECT 
                st.id AS ticket_id,
                st.ticket_number,
                st.user_id,
                st.subject,
                st.description,
                st.status,
                st.priority,
                st.created_at AS ticket_created_at,
                st.email AS ticket_email,
                st.ticket_date,
                st.work_phone AS ticket_work_phone,
                st.current_status,
                st.current_priority,
                eu.user_id,
                eu.name AS user_name,
                eu.email AS user_email,
                eu.work_phone AS user_work_phone,
                eu.addr_line1,
                eu.addr_line2,
                eu.city,
                eu.state,
                eu.postal
            FROM support_tickets st
            LEFT JOIN external_users eu ON st.user_id = eu.user_id
            WHERE st.ticket_number = ?`,
            [ticketNumber]
        );

        if (tickets.length === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.json(tickets[0]);
    } catch (error) {
        console.error("❌ Error fetching support ticket:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
