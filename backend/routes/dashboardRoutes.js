import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",authenticateToken, async (req, res) => {
  res.json({ user: { email: req.user.email, tenantId: req.user.tenantId, role: req.user.role , fullName: req.user.fullName} });
});

export default router;
