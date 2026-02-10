/**
 * errorHandler.js — Global error handling middleware
 * 
 * Catches all errors thrown in controllers/routes and
 * returns a clean JSON response to the client.
 */

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
