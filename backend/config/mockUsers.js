import express from "express";

const router = express.Router();

// Mock Users Data
const mockUsers = [
  { fullName: "John Doe", email: "john@example.com", password: "123456", tenant_id: null, role: "user" },
  { fullName: "Jane Smith", email: "jane@example.com", password: "123456", tenant_id: null, role: "user" },
  { fullName: "Alice Johnson", email: "alice@example.com", password: "123456", tenant_id: null, role: "user" },
  { fullName: "Robert Brown", email: "robert@example.com", password: "123456", tenant_id: null, role: "user" },
  { fullName: "Emily Davis", email: "emily@example.com", password: "123456", tenant_id: null, role: "user" },
  { fullName: "Michael Wilson", email: "michael@example.com", password: "123456", tenant_id: null, role: "user" },
  { fullName: "Sarah Miller", email: "sarah@example.com", password: "123456", tenant_id: null, role: "user" },
  { fullName: "David Anderson", email: "david@example.com", password: "123456", tenant_id: null, role: "user" },
  { fullName: "Laura Thomas", email: "laura@example.com", password: "123456", tenant_id: null, role: "user" },
  { fullName: "Kevin White", email: "kevin@example.com", password: "123456", tenant_id: null, role: "user" }
];

// GET API to Fetch Mock Users Only
router.get("/", (req, res) => {
  res.json(mockUsers);
});

export default router;
