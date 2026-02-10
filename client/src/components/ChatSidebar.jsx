/**
 * ChatSidebar.jsx — Sliding AI financial coach chat panel
 * 
 * Opens from the right side of the screen. Users can ask
 * questions about their spending, get advice, and describe
 * transactions for the AI to understand.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Brain,
  User,
  Sparkles,
} from "lucide-react";
import api from "../api/axios";

const SUGGESTIONS = [
  "How much did I spend this month?",
  "What's my biggest expense category?",
  "Give me tips to save money",
  "Summarize my spending habits",
];

const ChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm your FinMind AI coach. I can see your spending data and help you manage your finances. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Build conversation history (skip the initial greeting)
      const history = newMessages.slice(1).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content,
      }));

      const { data } = await api.post("/chat", {
        message: userMessage,
        history: history.slice(0, -1), // exclude the message we just sent
      });

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/40 md:bottom-6 md:right-6 md:h-14 md:w-14 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
        title="Chat with AI Coach"
      >
        <MessageSquare size={22} strokeWidth={2} />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-slate-800/60 bg-slate-950 shadow-2xl sm:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/60 px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600/15">
                  <Brain size={16} className="text-cyan-400" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    FinMind AI
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Your financial coach
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        msg.role === "user"
                          ? "bg-indigo-600/20"
                          : "bg-violet-600/15"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User size={13} className="text-indigo-400" strokeWidth={2} />
                      ) : (
                        <Sparkles size={13} className="text-violet-400" strokeWidth={2} />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-tr-md bg-indigo-600 text-white"
                          : "rounded-tl-md border border-slate-800/60 bg-slate-800/40 text-slate-300"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600/15">
                      <Sparkles size={13} className="text-violet-400" strokeWidth={2} />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-slate-800/60 bg-slate-800/40 px-4 py-3">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick suggestions (shown only when few messages) */}
            {messages.length <= 2 && !loading && (
              <div className="border-t border-slate-800/40 px-4 py-3">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-lg border border-slate-800/50 bg-slate-800/30 px-2.5 py-1.5 text-[11px] text-slate-400 transition hover:border-indigo-500/30 hover:text-indigo-400"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-slate-800/60 px-4 pb-4 pt-3 sm:pb-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your finances…"
                  disabled={loading}
                  className="flex-1 rounded-xl border border-slate-700/50 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatSidebar;
