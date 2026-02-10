/**
 * gemini.service.js — AI Transaction Categorization via Groq
 *
 * Token-optimized:
 *  1. Local keyword matching skips AI entirely for obvious categories
 *  2. Cached category list avoids DB queries on every call
 *  3. Minimal prompt + max_tokens cap
 *  4. Uses Groq (Llama 3.3 70B) — fast & free tier friendly
 */

const Groq = require("groq-sdk");
const { getCategoryNames } = require("./categoryCache");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Local keyword map (skip AI for obvious matches) ──
const KEYWORD_MAP = {
  Food: [
    "zomato", "swiggy", "mcdonald", "domino", "pizza", "burger",
    "restaurant", "cafe", "starbucks", "kfc", "subway", "food",
    "biryani", "dunkin", "bakery", "grocery", "grofers", "blinkit",
    "bigbasket", "zepto", "instamart", "mess", "canteen", "dhaba",
  ],
  Transport: [
    "uber", "ola", "rapido", "auto", "taxi", "metro", "bus",
    "petrol", "diesel", "fuel", "parking", "toll", "irctc",
    "train", "flight", "indigo", "spicejet", "redbus",
  ],
  Shopping: [
    "amazon", "flipkart", "myntra", "ajio", "meesho", "nykaa",
    "mall", "shopping", "store", "market", "reliance",
  ],
  Entertainment: [
    "netflix", "spotify", "hotstar", "prime video", "youtube",
    "movie", "cinema", "pvr", "inox", "game", "steam", "playstation",
  ],
  Bills: [
    "electricity", "water bill", "gas bill", "internet", "wifi",
    "broadband", "airtel", "jio", "postpaid", "prepaid", "dth",
    "recharge", "emi", "loan",
  ],
  Health: [
    "pharmacy", "hospital", "doctor", "medical", "medicine",
    "apollo", "1mg", "pharmeasy", "netmeds", "gym", "fitness",
  ],
  Education: [
    "udemy", "coursera", "book", "stationery", "tuition",
    "college", "school", "exam", "coaching",
  ],
  Rent: ["rent", "landlord", "housing", "pg ", "hostel"],
  Savings: ["savings", "deposit", "mutual fund", "sip", "invest", "fd", "rd"],
};

/**
 * Try to match a description to a category using local keywords.
 */
const localMatch = (description) => {
  const lower = description.toLowerCase();
  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return null;
};

/**
 * Classify a transaction description into a category.
 * Uses local keyword matching first; falls back to Groq only if needed.
 */
const classifyTransaction = async (description) => {
  try {
    // 1. Fast local match — zero tokens used
    const categories = await getCategoryNames();
    const local = localMatch(description);
    if (local && categories.includes(local)) {
      return local;
    }

    // 2. Groq call (only if local match fails)
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Classify transactions into one of: ${categories.join(",")}. Reply with ONLY the category name.`,
        },
        { role: "user", content: description },
      ],
      max_tokens: 10,
      temperature: 0,
    });

    const aiCategory = completion.choices[0]?.message?.content?.trim();

    const matched = categories.find(
      (c) => c.toLowerCase() === aiCategory?.toLowerCase()
    );

    if (matched) return matched;

    console.warn(`⚠️ Groq returned "${aiCategory}" for "${description}" — fallback "Other"`);
    return "Other";
  } catch (error) {
    console.error("❌ Classification failed:", error.message);
    return "Other";
  }
};

module.exports = { classifyTransaction };
