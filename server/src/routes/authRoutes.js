/**
 * authRoutes.js — Defines all authentication-related API endpoints
 * 
 * Base path: /api/auth
 * 
 * Routes:
 *   POST /register  — Create a new user account
 *   POST /login     — Authenticate and receive tokens
 *   POST /refresh   — Get a new access token using refresh cookie
 *   POST /logout    — Clear the refresh token cookie
 *   GET  /me        — Get the current user's profile (protected)
 */

const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refresh,
  logout,
  getMe,
  deleteAccount,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.delete("/account", authMiddleware, deleteAccount);

module.exports = router;
