/**
 * chatController.js — Handles AI financial coach chat
 * 
 * Endpoint:
 *   POST /api/chat — Send a message and get AI financial advice
 */

const { chatWithCoach } = require("../services/chat.service");

const sendMessage = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required.",
      });
    }

    const reply = await chatWithCoach(userId, message.trim(), history || []);

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage };
