/**
 * db.js — Singleton Prisma Client instance
 * 
 * Import this wherever you need database access.
 * Ensures only one PrismaClient exists across the app.
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
