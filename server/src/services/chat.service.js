/**
 * chat.service.js — AI Financial Coach via Groq
 *
 * Token-optimized:
 *  1. Fetches only 30 recent transactions
 *  2. Compact spending summary
 *  3. Conversation history capped at last 6 messages
 *  4. max_tokens cap prevents verbose replies
 *  5. In-memory summary cache (2 min TTL)
 *  6. Uses Groq (Llama 3.3 70B) — fast & free tier friendly
 */

const Groq = require("groq-sdk");
const prisma = require("../db");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Summary cache per user (TTL 2 min) ──
const summaryCache = new Map();
const SUMMARY_TTL = 2 * 60 * 1000;

/**
 * Build a compact spending summary string.
 */
const buildSpendingSummary = (transactions) => {
  if (!transactions.length) return "No transactions yet.";

  const total = transactions.reduce((s, t) => s + t.amount, 0);
  const catMap = {};
  transactions.forEach((t) => {
    const cat = t.category?.name || "Other";
    catMap[cat] = (catMap[cat] || 0) + t.amount;
  });

  const breakdown = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `${cat}:₹${Math.round(amt)}`)
    .join(", ");

  const now = new Date();
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlyTotal = thisMonth.reduce((s, t) => s + t.amount, 0);

  return `Txns:${transactions.length} | Total:₹${Math.round(total)} | This month:₹${Math.round(monthlyTotal)}(${thisMonth.length} txns) | By category: ${breakdown}`;
};

/**
 * Get spending summary for a user (cached 2 min).
 */
const getSummary = async (userId) => {
  const cached = summaryCache.get(userId);
  if (cached && Date.now() - cached.ts < SUMMARY_TTL) {
    return cached.summary;
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
    take: 30,
  });

  const summary = buildSpendingSummary(transactions);
  summaryCache.set(userId, { summary, ts: Date.now() });
  return summary;
};

/** Invalidate cache for a user (call after adding/deleting transactions) */
const invalidateSummaryCache = (userId) => {
  summaryCache.delete(userId);
};

const MAX_HISTORY = 6; // Keep last 6 messages (3 turns)

/**
 * Chat with the AI financial coach.
 */
const chatWithCoach = async (userId, userMessage, conversationHistory = []) => {
  try {
    const summary = await getSummary(userId);

    // Trim history to last N messages
    const trimmedHistory = conversationHistory.slice(-MAX_HISTORY);

    const messages = [
      {
        role: "system",
        content: `You are FinMind AI, a concise financial coach. User's data: ${summary}
Rules: Use ₹(INR). 2-3 sentences max. Be specific with numbers from the data. Be encouraging but honest.`,
      },
      ...trimmedHistory.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      { role: "user", content: userMessage },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 256,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("❌ Chat failed:", error.message);
    return "Sorry, I'm having trouble right now. Please try again in a moment.";
  }
};

module.exports = { chatWithCoach, invalidateSummaryCache };
