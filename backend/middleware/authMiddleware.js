import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authenticateToken(req, res, next) {
  
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error("No authorization header found");
    return res.status(401).json({ error: "Unauthorized, no token provided" });
  }

  // Handle both "Bearer <TOKEN>" and "<TOKEN>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  });
}
