/**
 * ReceiptPreviewModal.jsx — Multi-transaction preview from scanned image
 * 
 * Shows the uploaded image on the left and all AI-extracted
 * transactions on the right. Each row is editable and can be
 * toggled on/off before batch saving.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  IndianRupee,
  FileText,
  Calendar,
  Tag,
  Check,
  Loader2,
  Trash2,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Rent",
  "Utilities",
  "Shopping",
  "Health",
  "Education",
  "Subscriptions",
  "Other",
];

const ReceiptPreviewModal = ({ imagePreview, extractedData, onSave, onClose }) => {
  // extractedData is now an array of transactions
  const items = Array.isArray(extractedData) ? extractedData : [extractedData];

  const [transactions, setTransactions] = useState(
    items.map((item, i) => ({
      id: i,
      enabled: true,
      amount: item.amount || "",
      description: item.description || "",
      date: item.date || new Date().toISOString().split("T")[0],
      category: item.category || "Other",
      type: item.type || "debit",
    }))
  );
  const [saving, setSaving] = useState(false);

  const updateField = (id, key, value) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [key]: value } : t))
    );
  };

  const toggleEnabled = (id) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const enabledCount = transactions.filter((t) => t.enabled).length;

  const handleSave = async () => {
    const toSave = transactions
      .filter((t) => t.enabled && t.amount && t.description)
      .map(({ amount, description, date, category }) => ({
        amount,
        description,
        date,
        category,
      }));

    if (toSave.length === 0) return;

    setSaving(true);
    await onSave(toSave);
    setSaving(false);
  };

  const isMultiple = transactions.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative flex w-full max-w-3xl max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/60 px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-violet-400" strokeWidth={2} />
              <h3 className="text-sm font-semibold text-slate-200">
                {isMultiple
                  ? `${transactions.length} Transactions Found`
                  : "AI Extracted Data"}
              </h3>
              {isMultiple && (
                <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-medium text-violet-400">
                  {enabledCount} selected
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-4 overflow-hidden p-3 sm:gap-5 sm:p-5 md:flex-row">
            {/* Receipt image */}
            <div className="shrink-0 md:w-2/5">
              <div className="overflow-hidden rounded-xl border border-slate-800/40 bg-slate-800/30">
                <img
                  src={imagePreview}
                  alt="Uploaded screenshot"
                  className="h-auto max-h-40 w-full object-contain sm:max-h-64 md:max-h-[60vh]"
                />
              </div>
              <p className="mt-2 text-center text-xs text-slate-600">
                Uploaded image
              </p>
            </div>

            {/* Transaction list */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
              <p className="text-xs text-slate-500">
                {isMultiple
                  ? "Review, edit, or deselect transactions before saving."
                  : "Review & edit the extracted fields, then save."}
              </p>

              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`rounded-xl border p-3 transition-all ${
                    tx.enabled
                      ? "border-slate-700/50 bg-slate-800/30"
                      : "border-slate-800/30 bg-slate-900/50 opacity-50"
                  }`}
                >
                  {/* Transaction header with toggle */}
                  {isMultiple && (
                    <div className="mb-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                            tx.type === "credit"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-rose-500/15 text-rose-400"
                          }`}
                        >
                          {tx.type === "credit" ? (
                            <ArrowDown size={10} />
                          ) : (
                            <ArrowUp size={10} />
                          )}
                          {tx.type === "credit" ? "Received" : "Spent"}
                        </span>
                        <span className="text-xs font-medium text-slate-300">
                          ₹{tx.amount}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleEnabled(tx.id)}
                        className={`rounded-md px-2 py-1 text-[10px] transition ${
                          tx.enabled
                            ? "bg-slate-700/50 text-slate-400 hover:bg-rose-500/15 hover:text-rose-400"
                            : "bg-violet-500/15 text-violet-400 hover:bg-violet-500/25"
                        }`}
                      >
                        {tx.enabled ? "Skip" : "Include"}
                      </button>
                    </div>
                  )}

                  {/* Fields */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Amount */}
                    <div>
                      <label className="mb-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <IndianRupee size={10} strokeWidth={2} />
                        Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={tx.amount}
                        onChange={(e) =>
                          updateField(tx.id, "amount", e.target.value)
                        }
                        disabled={!tx.enabled}
                        className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 transition focus:border-violet-500/50 focus:outline-none disabled:opacity-50"
                        placeholder="0"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="mb-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <Tag size={10} strokeWidth={2} />
                        Category
                      </label>
                      <select
                        value={tx.category}
                        onChange={(e) =>
                          updateField(tx.id, "category", e.target.value)
                        }
                        disabled={!tx.enabled}
                        className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-100 transition focus:border-violet-500/50 focus:outline-none disabled:opacity-50"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description — full width */}
                    <div className="col-span-2">
                      <label className="mb-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <FileText size={10} strokeWidth={2} />
                        Description
                      </label>
                      <input
                        type="text"
                        value={tx.description}
                        onChange={(e) =>
                          updateField(tx.id, "description", e.target.value)
                        }
                        disabled={!tx.enabled}
                        className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 transition focus:border-violet-500/50 focus:outline-none disabled:opacity-50"
                        placeholder="Merchant or purchase"
                      />
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <label className="mb-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <Calendar size={10} strokeWidth={2} />
                        Date
                      </label>
                      <input
                        type="date"
                        value={tx.date}
                        onChange={(e) =>
                          updateField(tx.id, "date", e.target.value)
                        }
                        disabled={!tx.enabled}
                        className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-100 transition focus:border-violet-500/50 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer — Save button */}
          <div className="border-t border-slate-800/60 px-4 py-3 sm:px-5 sm:py-4">
            <button
              onClick={handleSave}
              disabled={saving || enabledCount === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={2} />
                  {isMultiple
                    ? `Save ${enabledCount} Transaction${enabledCount !== 1 ? "s" : ""}`
                    : "Confirm & Save"}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReceiptPreviewModal;
