/**
 * receiptRoutes.js — API endpoints for receipt scanning
 * 
 * Base path: /api/receipts
 * All routes are protected by authMiddleware.
 * 
 * Routes:
 *   POST /scan  — Upload receipt image & get AI-extracted fields
 *   POST /save  — Save the confirmed scanned transaction
 */

const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  scanReceiptImage,
  saveScannedTransaction,
} = require("../controllers/receiptController");

const authMiddleware = require("../middleware/authMiddleware");

// Configure multer — store in memory (no disk writes needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// All receipt routes require authentication
router.use(authMiddleware);

router.post("/scan", upload.single("receipt"), scanReceiptImage);
router.post("/save", saveScannedTransaction);

module.exports = router;
