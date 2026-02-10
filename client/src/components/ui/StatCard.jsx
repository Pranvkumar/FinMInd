/**
 * StatCard.jsx — Glassmorphism quick-stat card
 * 
 * Used on the dashboard hero section for:
 *   Total Balance, Monthly Income, Monthly Expense
 */

import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, variant = "default" }) => {
  const variantStyles = {
    default: "from-slate-800/80 to-slate-900/80 border-slate-700/50",
    income: "from-emerald-900/40 to-emerald-950/40 border-emerald-500/20",
    expense: "from-rose-900/40 to-rose-950/40 border-rose-500/20",
  };

  const iconStyles = {
    default: "bg-indigo-500/20 text-indigo-400",
    income: "bg-emerald-500/20 text-emerald-400",
    expense: "bg-rose-500/20 text-rose-400",
  };

  const valueStyles = {
    default: "text-white",
    income: "text-emerald-400",
    expense: "text-rose-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border bg-linear-to-br backdrop-blur-md p-5 shadow-xl ${variantStyles[variant]}`}
    >
      {/* Decorative blur circle */}
      <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className={`text-2xl font-bold tracking-tight ${valueStyles[variant]}`}>
            {value}
          </p>
          {trendLabel && (
            <p className="flex items-center gap-1 text-xs text-slate-400">
              {trend != null && (
                <span className={trend >= 0 ? "text-emerald-400" : "text-rose-400"}>
                  {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
                </span>
              )}
              {trendLabel}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`rounded-xl p-2.5 ${iconStyles[variant]}`}>
            <Icon size={20} strokeWidth={2} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
