import express from "express";
import db from "../config/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import axios from "axios";

const router = express.Router();

// Jotform Configuration
const jotformTableId = "250715431580452";
const jotformApiKey = "8043c17dda2e3d3371fa1cae71fc635b";
const jotformFields = {
    date: "34", // Field ID for "date"
    Name: "3", // Field ID for "Name"
    jobTitle: "6", // Field ID for "Job Title" (used as subject)
    email: "8", // Field ID for "Email"
    workPhone: "5", // Field ID for "Work Phone Number"
    pleaseExplain21: "21", // Field ID for "Description in detail"
};

async function syncJotformData() {
    try {
        const response = await axios.get(
            `https://api.jotform.com/form/${jotformTableId}/submissions?apiKey=${jotformApiKey}`
        );
        const jotformRecords = response.data.content;

        if (jotformRecords && jotformRecords.length > 0) {
            for (const record of jotformRecords) {
                const answers = record.answers;

                const jotformDate = answers?.[jotformFields.date]?.answer?.datetime || null;
                const name = answers?.[jotformFields.Name]?.answer?.prettyFormat || "";
                const jobTitle = answers?.[jotformFields.jobTitle]?.answer || "No Subject";
                const email = answers?.[jotformFields.email]?.answer || "No Email";
                const workPhone = answers?.[jotformFields.workPhone]?.answer?.full || "No Phone";
                const description = answers?.[jotformFields.pleaseExplain21]?.answer || "No Description";

                const formattedDate = jotformDate ? new Date(jotformDate).toISOString().split('T')[0] : null;

                const [existingRecords] = await db.execute(
                    "SELECT * FROM support_tickets WHERE ticket_number = ?",
                    [record.id]
                );

                if (existingRecords.length === 0) {
                    await db.execute(
                        "INSERT INTO support_tickets (ticket_number, subject, description, user_id, status, priority, created_at, updated_at, email, ticket_date, work_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        [
                            record.id,
                            jobTitle, // Using jobTitle as subject
                            description,
                            null,
                            "Open",
                            "Medium",
                            new Date(),
                            new Date(),
                            email,
                            formattedDate,
                            workPhone,
                        ]
                    );
                    console.log(`Synced Jotform record ${record.id}`);
                } else {
                    console.log(`Jotform record ${record.id} already exists.`);
                }
            }
        } else {
            console.log("No new Jotform records to sync.");
        }
    } catch (error) {
        console.error("Error syncing Jotform data:", error.message);
    }
}

// Route to fetch tickets and sync data
router.get("/", authenticateToken, async (req, res) => {
    try {
        //await syncJotformData();
        const [tickets] = await db.execute("SELECT * FROM support_tickets ORDER BY created_at DESC");
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/assignedTickets", authenticateToken, async (req, res) => {
    try {
        const userId = req.headers["user_id"]; // Extract from headers
        if (!userId) {
            return res.status(400).json({ error: "User ID is required in headers." });
        }

        const [tickets] = await db.execute(
            `SELECT distinct
                st.id,
                st.ticket_number,
                st.user_id,
                st.subject,
                st.description,
                st.status,
                st.priority,
                st.created_at,
                st.updated_at,
                st.closed_at,
                st.email,
                st.ticket_date,
                st.work_phone,
                st.current_status,
                st.current_priority
             FROM support_tickets st
             LEFT JOIN TicketTransactions tt 
             ON st.ticket_number = tt.ticket_number
             WHERE tt.assigned_to = ?
             ORDER BY st.created_at DESC;`,
            [userId]
        );

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search tickets with filters
router.get("/search", authenticateToken, async (req, res) => {
    try {
      const { ticketId, status, priority, dateFrom, dateTo } = req.query;
  
      let query = "SELECT * FROM support_tickets WHERE 1=1";
      const params = [];
  
      if (ticketId) {
        query += " AND ticket_number LIKE ?";
        params.push(`%${ticketId}%`);
      }

      if (status) {
        query += " AND current_status = ?";
        params.push(status);
      }
  
      if (priority) {
        query += " AND current_priority = ?";
        params.push(priority);
      }

      if (dateFrom) {
        query += " AND DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') >= ?";
        params.push(dateFrom);
      }
  
      if (dateTo) {
        query += " AND DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') <= ?";
        params.push(dateTo);
      }
          
      query += " ORDER BY created_at DESC";
  
      const [tickets] = await db.execute(query, params);
      
      res.json(tickets);
    } catch (error) {
      console.error("Search Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/assignedTickets/search", authenticateToken, async (req, res) => {
    try {
      const userId = req.headers["user_id"]; // Extract from headers
      if (!userId) {
        return res.status(400).json({ error: "User ID is required in headers." });
      }
  
      const { ticketId, status, priority, dateFrom, dateTo } = req.query;
  
      let query = `
        SELECT DISTINCT
          st.id,
          st.ticket_number,
          st.user_id,
          st.subject,
          st.description,
          st.status,
          st.priority,
          st.created_at,
          st.updated_at,
          st.closed_at,
          st.email,
          st.ticket_date,
          st.work_phone,
          st.current_status,
          st.current_priority
        FROM support_tickets st
        LEFT JOIN TicketTransactions tt 
          ON st.ticket_number = tt.ticket_number
        WHERE tt.assigned_to = ?
      `;
  
      const params = [userId];
  
      if (ticketId) {
        query += " AND st.ticket_number LIKE ?";
        params.push(`%${ticketId}%`);
      }
  
      if (status) {
        query += " AND st.current_status = ?";
        params.push(status);
      }
  
      if (priority) {
        query += " AND st.current_priority = ?";
        params.push(priority);
      }
  
      if (dateFrom) {
        query += " AND DATE_FORMAT(st.created_at, '%Y-%m-%d %H:%i') >= ?";
        params.push(dateFrom);
      }
  
      if (dateTo) {
        query += " AND DATE_FORMAT(st.created_at, '%Y-%m-%d %H:%i') <= ?";
        params.push(dateTo);
      }
  
      query += " ORDER BY st.created_at DESC";
  
      const [tickets] = await db.execute(query, params);
  
      res.json(tickets);
    } catch (error) {
      console.error("Assigned Ticket Search Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

export default router;
