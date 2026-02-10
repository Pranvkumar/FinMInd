/**
 * transactionRoutes.js — API endpoints for transactions
 * 
 * Base path: /api/transactions
 * All routes are protected by authMiddleware (user must be logged in).
 * 
 * Routes:
 *   POST   /             — Create a new AI-categorized transaction
 *   GET    /             — Get all transactions for the logged-in user
 *   DELETE /:id          — Delete a specific transaction
 */

const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getTransactions,
  deleteTransaction,
  clearAllTransactions,
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");

// All transaction routes require authentication
router.use(authMiddleware);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.delete("/all", clearAllTransactions);
router.delete("/:id", deleteTransaction);

module.exports = router;
