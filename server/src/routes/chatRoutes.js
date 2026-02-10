/**
 * chatRoutes.js — API endpoint for AI financial coach
 * 
 * Base path: /api/chat
 * Protected by authMiddleware.
 * 
 * Routes:
 *   POST /  — Send message, receive AI financial advice
 */

const express = require("express");
const router = express.Router();

const { sendMessage } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", sendMessage);

module.exports = router;
