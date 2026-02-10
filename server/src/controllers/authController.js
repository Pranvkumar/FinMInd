/**
 * authController.js — Handles Registration, Login, Token Refresh & Logout
 * 
 * "Double Token" Strategy:
 *   - Access Token  → short-lived (15m), sent in response body.
 *   - Refresh Token → long-lived (7d), sent as httpOnly Secure cookie.
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../db");

// ──────────────────────────────────────────────
// Helper: Generate Tokens
// ──────────────────────────────────────────────

/**
 * Creates a short-lived Access Token containing the user's id and email.
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

/**
 * Creates a long-lived Refresh Token containing only the user's id.
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

/**
 * Attaches the refresh token as a secure httpOnly cookie.
 */
const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ──────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters.",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists.",
      });
    }

    // Hash the password (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token as httpOnly cookie
    setRefreshCookie(res, refreshToken);

    // Respond with the access token (never send the password back)
    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token as httpOnly cookie
    setRefreshCookie(res, refreshToken);

    // Respond with the access token
    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// POST /api/auth/refresh
// ──────────────────────────────────────────────

const refresh = async (req, res, next) => {
  try {
    // 1. Read the refresh token from the httpOnly cookie
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No refresh token. Please log in again.",
      });
    }

    // 2. Verify the refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // 3. Look up the user (ensures they still exist)
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User no longer exists.",
      });
    }

    // 4. Issue a fresh pair of tokens (token rotation)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid refresh token. Please log in again.",
    });
  }
};

// ──────────────────────────────────────────────
// POST /api/auth/logout
// ──────────────────────────────────────────────

const logout = (req, res) => {
  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// ──────────────────────────────────────────────
// GET /api/auth/me  (Protected — requires authMiddleware)
// ──────────────────────────────────────────────

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// DELETE /api/auth/account  (Protected)
// ──────────────────────────────────────────────

const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Delete all user transactions first
    await prisma.transaction.deleteMany({ where: { userId } });

    // Delete the user
    await prisma.user.delete({ where: { id: userId } });

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh, logout, getMe, deleteAccount };
