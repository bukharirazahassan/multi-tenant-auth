import db from "../config/db.js";
import axios from "axios";

// Jotform Configuration
const jotformTableId = "250715431580452";
const jotformApiKey = "0afa0fb4aca3dd5985d34d5d24fd6e08";
const jotformFields = {
    date: "34",
    firstName: "3",
    lastName: "3",
    jobTitle: "6",
    email: "8",
    workPhone: "5",
    pleaseExplain21: "21",
    address: "4", // Use base address ID to extract nested fields
};

// Function to generate a random 6-digit user_id
const generateUserId = () => Math.floor(100000 + Math.random() * 900000);

// Function to extract address details safely
const getAddress = (answers) => {
    const addr = answers?.[jotformFields.address]?.answer; // Get full address object
   
    return {
        addr_line1: addr?.addr_line1 || addr?.street || "",
        addr_line2: addr?.addr_line2 || "",
        city: addr?.city || "",
        state: addr?.state || "",
        postal: addr?.postal || addr?.zip || ""
    };
};

async function syncJotformData() {
    try {
        console.log("🔄 Starting Jotform data sync...");

        // Fetch data from Jotform
        const { data } = await axios.get(
            `https://api.jotform.com/form/${jotformTableId}/submissions?apiKey=${jotformApiKey}`
        );
       
        if (!data?.content?.length) {
            console.log("✅ No new Jotform records to sync.");
            return;
        }

       
        const connection = await db.getConnection(); // Start DB transaction
        try {
            await connection.beginTransaction();

            for (const record of data.content) {
                const answers = record.answers;

                // Extract necessary data
                const jotformDate = answers?.[jotformFields.date]?.answer?.datetime || null;
                const formattedDate = jotformDate ? new Date(jotformDate).toISOString().split('T')[0] : null;

                let firstName = answers?.[jotformFields.firstName]?.answer?.first?.trim() || "";
                let lastName = answers?.[jotformFields.lastName]?.answer?.last?.trim() || "";
                const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : "Unknown User";

                const jobTitle = answers?.[jotformFields.jobTitle]?.answer || "No Subject";
                const email = answers?.[jotformFields.email]?.answer || "No Email";
                const workPhone = answers?.[jotformFields.workPhone]?.answer?.full || "No Phone";
                const description = answers?.[jotformFields.pleaseExplain21]?.answer || "No Description";

                // Extract Address
                const { addr_line1, addr_line2, city, state, postal } = getAddress(answers);
                
                // Check if user exists
                let [existingUser] = await connection.execute(
                    "SELECT user_id FROM external_users WHERE email = ? LIMIT 1",
                    [email]
                );

                let userId = existingUser.length ? existingUser[0].user_id : generateUserId();

                if (!existingUser.length) {
                    await connection.execute(
                        `INSERT INTO external_users 
                        (user_id, name, email, work_phone, addr_line1, addr_line2, city, state, postal) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [userId, fullName, email, workPhone, addr_line1, addr_line2, city, state, postal]
                    );
                    console.log(`✅ New user created with ID: ${userId}`);
                } else {
                    console.log(`✅ Existing user found: userID=${userId}`);
                }

                // Check if ticket already exists
                let [existingRecords] = await connection.execute(
                    "SELECT 1 FROM support_tickets WHERE ticket_number = ? LIMIT 1",
                    [record.id]
                );

                if (!existingRecords.length) {
                    await connection.execute(
                        `INSERT INTO support_tickets 
                        (ticket_number, subject, description, user_id, status, priority, created_at, updated_at, email, ticket_date, work_phone) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            record.id,
                            jobTitle,
                            description,
                            userId,
                            "Open",
                            "Medium",
                            new Date(),
                            new Date(),
                            email,
                            formattedDate,
                            workPhone,
                        ]
                    );
                    console.log(`✅ Synced Jotform record ${record.id}`);
                } else {
                    console.log(`ℹ️ Ticket ${record.id} already exists. Skipping.`);
                }
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            console.error("❌ Transaction failed:", error.message);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("❌ Error syncing Jotform data:", error.message);
    }
}

// ✅ Export correctly for server.js
export default syncJotformData;
