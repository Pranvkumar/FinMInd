/**
 * TransactionList.jsx — Upgraded transaction history
 * 
 * Groups transactions by "Today", "Yesterday", "This Month", "Older".
 * Uses colored category icons, glassmorphism cards, framer-motion
 * animations, and subtle borders per the design system.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Sparkles, Clock } from "lucide-react";
import api from "../api/axios";
import { toast } from "sonner";
import EmptyState from "./ui/EmptyState";
import {
  groupTransactionsByDate,
  getCategoryColor,
  formatCurrency,
} from "../utils/chartHelpers";

const TransactionList = ({ transactions, onTransactionDeleted }) => {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
      if (onTransactionDeleted) {
        onTransactionDeleted(id);
      }
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      toast.error("Failed to delete transaction");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No transactions yet"
        description="Add your first expense and it'll show up here, beautifully categorized by AI."
      />
    );
  }

  const grouped = groupTransactionsByDate(transactions);

  return (
    <div className="space-y-6">
      {grouped.map(([groupLabel, txs]) => (
        <div key={groupLabel}>
          {/* Group header */}
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {groupLabel}
            </h3>
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-600">{txs.length}</span>
          </div>

          {/* Transaction cards */}
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {txs.map((tx, i) => {
                const color = getCategoryColor(tx.category?.name);
                return (
                  <motion.div
                    key={tx.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="group flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-800/30 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-slate-800/60"
                  >
                    {/* Category icon with coloured bg */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${color.bg} ${color.border}`}
                    >
                      <span className="text-lg">{tx.category?.icon || "📁"}</span>
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-200">
                        {tx.description}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                        <span>{formatDate(tx.date)}</span>
                        <span className="text-slate-700">•</span>
                        <span className={`${color.text} flex items-center gap-1`}>
                          {tx.isAIIdentified && (
                            <Sparkles size={10} className="text-amber-400" />
                          )}
                          {tx.category?.name || "Uncategorized"}
                        </span>
                      </div>
                    </div>

                    {/* Amount + delete */}
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-semibold text-rose-400">
                        -{formatCurrency(tx.amount)}
                      </span>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="rounded-lg p-1.5 text-slate-600 opacity-100 transition-all hover:bg-rose-500/10 hover:text-rose-400 md:opacity-0 md:group-hover:opacity-100"
                        title="Delete transaction"
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
