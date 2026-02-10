/**
 * authMiddleware.js — Protects routes by verifying the Access Token
 * 
 * Usage: router.get("/protected", authMiddleware, controller);
 * 
 * Strategy:
 *   1. Read the "Authorization: Bearer <token>" header.
 *   2. Verify the JWT using JWT_SECRET.
 *   3. Attach decoded user data to req.user.
 *   4. If invalid/expired, return 401.
 */

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1. Extract the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify the access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user payload to the request object
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;
