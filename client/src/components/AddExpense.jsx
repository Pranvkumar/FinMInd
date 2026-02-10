/**
 * AddExpense.jsx — Glassmorphism expense form
 * 
 * Fields: Amount (₹), Description (text)
 * On submit, calls POST /api/transactions.
 * AI categorization happens on the backend; result shown via toast.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, FileText, Plus, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axios";

const AddExpense = ({ onTransactionAdded }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !description.trim()) {
      toast.error("Both amount and description are required.");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid positive amount.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/transactions", {
        amount: parseFloat(amount),
        description: description.trim(),
      });

      if (data.success) {
        toast.success("Transaction Saved", {
          description: `₹${amount} → ${data.transaction.category.icon} ${data.transaction.category.name}`,
        });
        setAmount("");
        setDescription("");

        if (onTransactionAdded) {
          onTransactionAdded(data.transaction);
        }
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to add transaction. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-800/60 bg-linear-to-br from-slate-800/50 to-slate-900/50 p-5 shadow-xl backdrop-blur-md"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-xl bg-indigo-500/15 p-2">
          <Plus size={16} className="text-indigo-400" strokeWidth={2} />
        </div>
        <h2 className="text-sm font-semibold text-slate-200">Add Expense</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Amount */}
        <div className="relative">
          <IndianRupee
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            strokeWidth={2}
          />
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 py-2.5 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-600 transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div className="relative">
          <FileText
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            strokeWidth={2}
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Uber ride to airport"
            className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 py-2.5 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-600 transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
            disabled={loading}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <Sparkles size={14} className="text-amber-300" />
              <span>AI is categorizing…</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              Add Expense
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default AddExpense;
