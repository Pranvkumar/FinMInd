/**
 * chartHelpers.js — Utility functions for formatting transaction data for Recharts
 * 
 * Never hardcode chart data — these helpers dynamically aggregate
 * transactions into the shapes Recharts needs.
 */

/**
 * Groups transactions by day for the last N days and returns
 * an array suitable for Recharts AreaChart.
 *
 * @param {Array} transactions - Raw transaction list from API
 * @param {number} days - Number of past days to include (default 7)
 * @returns {Array<{date: string, amount: number, label: string}>}
 */
export const getSpendingByDay = (transactions, days = 7) => {
  const now = new Date();
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const dayStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });

    const total = transactions
      .filter((tx) => {
        const txDate = new Date(tx.date);
        txDate.setHours(0, 0, 0, 0);
        return txDate.getTime() === d.getTime();
      })
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    result.push({ date: dayStr, amount: Math.round(total * 100) / 100, label });
  }

  return result;
};

/**
 * Calculates total spending for the current month.
 */
export const getMonthlyExpense = (transactions) => {
  const now = new Date();
  return transactions
    .filter((tx) => {
      const d = new Date(tx.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
};

/**
 * Groups transactions by "Today", "Yesterday", "Earlier this month", "Older"
 */
export const groupTransactionsByDate = (transactions) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const groups = {
    Today: [],
    Yesterday: [],
    "This Month": [],
    Older: [],
  };

  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    txDate.setHours(0, 0, 0, 0);

    if (txDate.getTime() === today.getTime()) {
      groups.Today.push(tx);
    } else if (txDate.getTime() === yesterday.getTime()) {
      groups.Yesterday.push(tx);
    } else if (txDate >= monthStart) {
      groups["This Month"].push(tx);
    } else {
      groups.Older.push(tx);
    }
  });

  // Return only non-empty groups
  return Object.entries(groups).filter(([, txs]) => txs.length > 0);
};

/**
 * Returns a color class based on category name for the icon background.
 */
export const getCategoryColor = (categoryName) => {
  const colors = {
    Food: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/20" },
    Transport: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/20" },
    Entertainment: { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/20" },
    Rent: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/20" },
    Utilities: { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/20" },
    Shopping: { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/20" },
    Health: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/20" },
    Education: { bg: "bg-indigo-500/15", text: "text-indigo-400", border: "border-indigo-500/20" },
    Subscriptions: { bg: "bg-violet-500/15", text: "text-violet-400", border: "border-violet-500/20" },
    Other: { bg: "bg-slate-500/15", text: "text-slate-400", border: "border-slate-500/20" },
  };

  return colors[categoryName] || colors.Other;
};

/**
 * Format currency in INR
 */
export const formatCurrency = (amount) => {
  const num = parseFloat(amount);
  return num.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
