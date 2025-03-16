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
        await syncJotformData();
        const [tickets] = await db.execute("SELECT * FROM support_tickets");
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
