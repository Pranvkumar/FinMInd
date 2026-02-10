/**
 * receipt.service.js — AI Receipt Scanner via Groq Vision
 *
 * Uses Llama 4 Scout Vision model on Groq for receipt/screenshot parsing.
 * Falls back gracefully with detailed error messages.
 */

const Groq = require("groq-sdk");
const { getCategoryNames } = require("./categoryCache");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Extract transaction details from a receipt image buffer.
 *
 * @param {Buffer} imageBuffer - The raw image file data
 * @param {string} mimeType - e.g. "image/png", "image/jpeg"
 * @returns {Promise<Object>} - { success, data/error }
 */
const scanReceipt = async (imageBuffer, mimeType) => {
  try {
    const categoryNames = await getCategoryNames();

    const base64Image = imageBuffer.toString("base64");
    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract ALL transactions from this receipt/screenshot as a JSON array.
Each object: {"amount":<number>,"description":"<string>","date":"<YYYY-MM-DD|null>","category":"<one of: ${categoryNames.join(",")}>","type":"<debit|credit>"}
Rules: JSON array only, no markdown. Single txn = array of 1. "+"/ green = credit, "-"/red/plain = debit. Unknown fields: null or 0. No transactions found: [{"error":"No transactions found"}]`,
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 1024,
      temperature: 0,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || "";

    // Parse JSON (strip markdown fences if present)
    const cleaned = responseText
      .replace(/^```json?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const transactions = Array.isArray(parsed) ? parsed : [parsed];

    if (transactions.length === 1 && transactions[0].error) {
      return { success: false, error: transactions[0].error };
    }

    // Validate categories
    const validatedTransactions = transactions
      .filter((t) => t && !t.error)
      .map((t) => {
        const matched = categoryNames.find(
          (c) => c.toLowerCase() === (t.category || "").toLowerCase()
        );
        return {
          amount: Math.abs(t.amount) || 0,
          description: t.description || "Unknown",
          date: t.date || null,
          category: matched || "Other",
          type: t.type === "credit" ? "credit" : "debit",
        };
      });

    if (validatedTransactions.length === 0) {
      return { success: false, error: "Could not extract any transactions from this image." };
    }

    return { success: true, data: validatedTransactions };
  } catch (error) {
    console.error("❌ Receipt scan failed:", error.message);
    console.error(error.stack);

    let detail = error.message || "Unknown error";
    if (error.message?.includes("API_KEY") || error.message?.includes("api_key") || error.message?.includes("Authentication")) {
      detail = "AI service API key is invalid or missing. Check your GROQ_API_KEY.";
    } else if (error.message?.includes("SAFETY") || error.message?.includes("content_filter")) {
      detail = "Image was blocked by AI safety filters. Try a clearer screenshot.";
    } else if (error.message?.includes("429") || error.message?.includes("rate_limit") || error.message?.includes("quota")) {
      detail = "AI service rate limit reached. Please wait a moment and try again.";
    } else if (error.message?.includes("JSON") || error.message?.includes("parse")) {
      detail = "AI returned an unreadable response. Try a clearer image.";
    } else if (error.message?.includes("ENOTFOUND") || error.message?.includes("ECONNREFUSED")) {
      detail = "Cannot reach AI service. Check your internet connection.";
    }

    return { success: false, error: "Failed to process the image.", detail };
  }
};

module.exports = { scanReceipt };
