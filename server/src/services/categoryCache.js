/**
 * categoryCache.js — In-memory category cache with TTL
 *
 * Avoids hitting the database on every Gemini API call.
 * Categories rarely change, so a 10-minute TTL is safe.
 */

const prisma = require("../db");

let cachedCategories = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Get category names from cache or DB.
 * @returns {Promise<string[]>} Array of category name strings
 */
const getCategoryNames = async () => {
  const now = Date.now();
  if (cachedCategories && now - cacheTimestamp < CACHE_TTL) {
    return cachedCategories;
  }

  const categories = await prisma.category.findMany({
    select: { name: true },
  });

  cachedCategories = categories.map((c) => c.name);
  cacheTimestamp = now;
  return cachedCategories;
};

/** Force-refresh cache (call after seeding or modifying categories) */
const invalidateCache = () => {
  cachedCategories = null;
  cacheTimestamp = 0;
};

module.exports = { getCategoryNames, invalidateCache };
