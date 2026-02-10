/**
 * receiptController.js — Handles receipt image upload & AI scanning
 * 
 * Endpoints:
 *   POST /api/receipts/scan   — Upload receipt image, get AI-extracted fields
 *   POST /api/receipts/save   — Save the confirmed transaction from a scan
 */

const prisma = require("../db");
const { scanReceipt } = require("../services/receipt.service");

// ──────────────────────────────────────────────
// POST /api/receipts/scan
// Accepts multipart image, returns extracted fields
// ──────────────────────────────────────────────
const scanReceiptImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file uploaded.",
      });
    }

    const { buffer, mimetype } = req.file;

    // Validate mime type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(mimetype)) {
      return res.status(400).json({
        success: false,
        error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
      });
    }

    // Max size check (5 MB)
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 5 MB.",
      });
    }

    const result = await scanReceipt(buffer, mimetype);

    if (!result.success) {
      return res.status(422).json({
        success: false,
        error: result.error,
        detail: result.detail || null,
      });
    }

    // result.data is now always an array of transactions
    res.status(200).json({
      success: true,
      extracted: result.data,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// POST /api/receipts/save
// Save one or many confirmed/edited transactions
// Accepts either a single object or { transactions: [...] }
// ──────────────────────────────────────────────
const saveScannedTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Support both single transaction and batch
    const items = req.body.transactions || [req.body];

    const savedTransactions = [];

    for (const item of items) {
      const { amount, description, date, category: categoryName } = item;

      if (!amount || !description) continue;

      // Find the category
      let category = await prisma.category.findUnique({
        where: { name: categoryName || "Other" },
      });

      if (!category) {
        category = await prisma.category.findUnique({
          where: { name: "Other" },
        });
      }

      const transaction = await prisma.transaction.create({
        data: {
          amount: parseFloat(amount),
          description: description.trim(),
          date: date ? new Date(date) : new Date(),
          isAIIdentified: true,
          userId,
          categoryId: category.id,
        },
        include: {
          category: true,
        },
      });

      savedTransactions.push(transaction);
    }

    if (savedTransactions.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid transactions to save.",
      });
    }

    res.status(201).json({
      success: true,
      transactions: savedTransactions,
      // Backwards compatible — also include single transaction
      transaction: savedTransactions[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { scanReceiptImage, saveScannedTransaction };
