import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mockUsersRoutes from "./config/mockUsers.js"; // ✅ Import the new mock users route
import setupSwagger from "./config/swagger.js";
import { requestLogger, errorLogger } from "./middleware/logger.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import seedSuperAdmin from "./routes/seedSuperAdmin.js"; 
import fetchExternalUsers from "./routes/fetchExternalUsers.js"; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Apply `authenticateToken` before logging middleware for protected routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

// Public routes (No authentication needed)
app.use("/api/auth", authRoutes);
app.use("/api/fetch-external-users", fetchExternalUsers);
app.use("/api/mock-users", mockUsersRoutes); // ✅ Add new route

setupSwagger(app);

const PORT = process.env.PORT || 5000;

// ✅ Run Super Admin seeding before starting the server
(async () => {
  await seedSuperAdmin();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  console.log(`📜 Swagger Docs available at http://localhost:${PORT}/api-docs`);
})();
