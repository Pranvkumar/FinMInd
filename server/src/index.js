/**
 * index.js — FinMind Server Entry Point
 * 
 * Initializes Express, connects middleware, mounts routes,
 * and starts listening on the configured PORT.
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────

// Parse JSON request bodies
app.use(express.json());

// Parse cookies (needed to read httpOnly refresh token)
app.use(cookieParser());

// Enable CORS
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"]
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Trust Render's proxy (needed for secure cookies)
app.set("trust proxy", 1);

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
  res.json({ message: "FinMind API is running 🚀" });
});

// Auth endpoints
app.use("/api/auth", authRoutes);

// Transaction endpoints
app.use("/api/transactions", transactionRoutes);

// Receipt scanning endpoints
app.use("/api/receipts", receiptRoutes);

// AI Chat endpoints
app.use("/api/chat", chatRoutes);

// ──────────────────────────────────────────────
// Error Handling (must be AFTER routes)
// ──────────────────────────────────────────────

app.use(errorHandler);

// ──────────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ FinMind server running on http://localhost:${PORT}`);
});
