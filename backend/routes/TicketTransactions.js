import express from "express";
import db from "../config/db.js"; // MySQL Database Connection
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 📌 Route to insert a new ticket transaction
 */
router.post("/addTransaction", authenticateToken, async (req, res) => {
    // ✅ Ensure consistent field naming (lowercase)
    const { ticket_number, external_user_id, assigned_by, assigned_to, ticket_status, comment, priority, Action_date } = req.body;

     if (!ticket_number || !external_user_id || !ticket_status) {
        return res.status(400).json({ error: "Missing required fields: ticket_number, external_user_id, ticket_status" });
    }

    try {
        const [result] = await db.execute(
            `INSERT INTO TicketTransactions 
            (ticket_number, external_user_id, assigned_by, assigned_to, ticket_status, comment, priority, Action_DateTime, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [ticket_number, external_user_id, assigned_by || null, assigned_to || null, ticket_status, comment || null, priority || null, Action_date || null ]
        );

        res.status(201).json({ message: "Transaction created successfully", transactionId: result.insertId });

        await db.execute(
            `UPDATE support_tickets 
            SET current_status = ?, current_priority = ? 
            WHERE ticket_number = ?`,
            [ticket_status, priority, ticket_number]
        );

     
    } catch (error) {
        console.error("❌ Error inserting ticket transaction:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

/**
 * 📌 Route to fetch a ticket transaction by ticket number
 */
router.get("/ticketTransaction", authenticateToken, async (req, res) => {
    const { ticket_number } = req.query;

    if (!ticket_number) {
        return res.status(400).json({ error: "Ticket number is required" });
    }

    try {
        const [ticketTransactions] = await db.execute(
            `SELECT 
                tt.TransactionId,
                tt.ticket_number,
                tt.external_user_id,
                eu.name AS external_user_name,
                eu.email AS external_user_email,
                tt.assigned_by,
                u.fullName AS assigned_by_name,
                tt.assigned_to,
                tt.ticket_status,
                tt.comment,
                tt.createdAt,
                tt.priority,
                tt.Action_DateTime
            FROM TicketTransactions tt
            INNER JOIN users u ON u.id = tt.assigned_by
            INNER JOIN external_users eu ON eu.user_id = tt.external_user_id
            WHERE tt.ticket_number = ?;`,
            [ticket_number]
        );

        if (ticketTransactions.length === 0) {
            return res.status(404).json({ message: "Ticket transaction not found" });
        }

        res.json(ticketTransactions);
    } catch (error) {
        console.error("❌ Error fetching ticket transaction:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

export default router;
