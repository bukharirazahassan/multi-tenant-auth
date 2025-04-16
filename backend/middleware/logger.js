import pool from "../config/db.js";

/**
 * Logs messages to the database
 * @param {string} level - Log level (info, error, warn)
 * @param {string} message - Log message
 * @param {string} route - The API route
 * @param {string|null} userEmail - User email (optional)
 * @param {string|null} userRole - User role (optional)
 */
export const logToDatabase = async (level, message, route, userEmail = null, userRole = null) => {
  try {
    await pool.query(
      "INSERT INTO logs (level, message, route, user_email, user_role) VALUES (?, ?, ?, ?, ?)",
      [level, message, route, userEmail, userRole]
    );
  } catch (error) {
    console.error("Logging failed:", error);
  }
};

// Middleware for logging requests
export const requestLogger = async (req, res, next) => {
 
    // Extract user data from req.user (set by auth middleware)
    const userEmail = req.user ? req.user.email : null;
    const userRole = req.user ? req.user.role : null;
    //console.log("userEmail>>>>>>>>>>>>>>>>>>>>", userEmail)
    await logToDatabase("info", `Request: ${req.method} ${req.url}`, req.url, userEmail, userRole);
    next();
};

// Middleware for logging errors
export const errorLogger = async (err, req, res, next) => {
   
    // Extract user data from req.user (set by auth middleware)
    const userEmail = req.user ? req.user.email : null;
    const userRole = req.user ? req.user.role : null;

    await logToDatabase("error", err.message, req.url, userEmail, userRole);
    res.status(500).json({ error: "Internal Server Error" });
};
