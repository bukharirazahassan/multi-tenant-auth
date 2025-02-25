import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  res.json({ user: { email: req.user.email, tenantId: req.user.tenantId } });
});

export default router;
