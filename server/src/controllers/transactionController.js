/**
 * transactionController.js — CRUD logic for user transactions
 * 
 * Endpoints:
 *   POST /api/transactions   — Create a new transaction (AI-categorized)
 *   GET  /api/transactions   — List all transactions for the logged-in user
 *   DELETE /api/transactions/:id — Delete a specific transaction
 */

const prisma = require("../db");
const { classifyTransaction } = require("../services/gemini.service");
const { invalidateSummaryCache } = require("../services/chat.service");

// ──────────────────────────────────────────────
// POST /api/transactions
// ──────────────────────────────────────────────

const createTransaction = async (req, res, next) => {
  try {
    const { amount, description, date } = req.body;
    const userId = req.user.id;

    // Validation
    if (!amount || !description) {
      return res.status(400).json({
        success: false,
        error: "Amount and description are required.",
      });
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be a positive number.",
      });
    }

    // 1. Ask Gemini to classify the transaction
    const categoryName = await classifyTransaction(description);

    // 2. Find (or create) the matching category in the DB
    let category = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    // If somehow the category doesn't exist yet, default to "Other"
    if (!category) {
      category = await prisma.category.findUnique({
        where: { name: "Other" },
      });
    }

    // 3. Save the transaction with Decimal amount
    const transaction = await prisma.transaction.create({
      data: {
        amount: amount,
        description: description.trim(),
        date: date ? new Date(date) : new Date(),
        isAIIdentified: categoryName !== "Other",
        userId,
        categoryId: category.id,
      },
      include: {
        category: true,
      },
    });

    // Invalidate chat summary cache so next chat uses fresh data
    invalidateSummaryCache(userId);

    res.status(201).json({
      success: true,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// GET /api/transactions
// ──────────────────────────────────────────────

const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: { date: "desc" },
    });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// DELETE /api/transactions/:id
// ──────────────────────────────────────────────

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Ensure the transaction belongs to the requesting user
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found.",
      });
    }

    if (transaction.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to delete this transaction.",
      });
    }

    await prisma.transaction.delete({ where: { id } });
    invalidateSummaryCache(userId);

    res.status(200).json({
      success: true,
      message: "Transaction deleted.",
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// DELETE /api/transactions/all — Clear all transactions
// ──────────────────────────────────────────────

const clearAllTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await prisma.transaction.deleteMany({
      where: { userId },
    });
    invalidateSummaryCache(userId);

    res.status(200).json({
      success: true,
      message: `Deleted ${result.count} transactions.`,
      count: result.count,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTransaction, getTransactions, deleteTransaction, clearAllTransactions };
