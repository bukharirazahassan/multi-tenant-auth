import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mockUsersRoutes from "./config/mockUsers.js"; 
import setupSwagger from "./config/swagger.js";
import { requestLogger, errorLogger } from "./middleware/logger.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import seedSuperAdmin from "./routes/seedSuperAdmin.js"; 
import fetchExternalUsers from "./routes/fetchExternalUsers.js"; 
import fetchExternalUsersJotform from "./routes/fetchExternalUsersJotform.js";
import supportTicketsRoutes from "./routes/supportTicketsRoutes.js";
import syncJotformData from "./routes/syncService.js";
import roleCounts from "./routes/userCounts.js"
import lineChartCounts from "./routes/userCounts.js"
import pichartTicketsCounts from "./routes/ticketCounts.js"
import seedTicketSummary from "./routes/seedTicketSummary.js"
import monthlySummarychart from "./routes/ monthlySummarychart.js"
import ticketSummaryOption from "./routes/fetchTicketSummaryOptions.js"
import weeklySummarychart from "./routes/weeklySummarychart.js"
import fetchUserAndTicketDetails from "./routes/fetchUserAndTicketDetails.js"
import TicketTransactions from "./routes/TicketTransactions.js"
import cron from "node-cron";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Apply logging middleware before authentication
app.use(requestLogger);

// Protected routes (require authentication)
app.use("/api/dashboard", authenticateToken, dashboardRoutes);
app.use("/api/users", authenticateToken, userRoutes);

// Public routes (No authentication needed)
app.use("/api/role-count", roleCounts);
app.use("/api/auth", authRoutes);
app.use("/api/fetch-external-users", fetchExternalUsers);
app.use("/api/fetch-external-users-Jotform", fetchExternalUsersJotform);
app.use("/api/mock-users", mockUsersRoutes);
app.use("/api/support-tickets", supportTicketsRoutes);
app.use("/api/tickets", lineChartCounts);
app.use("/api/fetch-tickets", pichartTicketsCounts);
app.use("/api/monthly-summary", ticketSummaryOption);
app.use("/api/monthly-chart", monthlySummarychart);
app.use("/api/weekly-chart", weeklySummarychart);
app.use("/api/ticketDetail",fetchUserAndTicketDetails);
app.use("/api/transaction",TicketTransactions)
// Set up Swagger API documentation
setupSwagger(app);

const PORT = process.env.PORT || 5000;

// 🕒 Schedule Jotform Sync every 10 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("🔄 Running Jotform sync...");
  try {
    await syncJotformData();
   
  } catch (error) {
    console.error("❌ Jotform sync failed:", error.message);
  }
});

// Start the server and seed the super admin
(async () => {
  try {
    await seedSuperAdmin();
    await seedTicketSummary();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    console.log(`📜 Swagger Docs available at http://localhost:${PORT}/api-docs`);
  } catch (error) {
    console.error("❌ Error initializing server:", error.message);
  }
})();

// Error handling middleware (always at the end)
app.use(errorLogger);
app.use((err, req, res, next) => {
  console.error("❌ Internal Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});
