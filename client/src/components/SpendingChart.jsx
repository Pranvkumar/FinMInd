/**
 * SpendingChart.jsx — 7-day "Spending Pulse" area chart
 * 
 * Uses Recharts AreaChart with gradient fill to show
 * spending trends over the past week.
 */

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getSpendingByDay, formatCurrency } from "../utils/chartHelpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-indigo-400">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const SpendingChart = ({ transactions }) => {
  const chartData = getSpendingByDay(transactions, 7);
  const hasData = chartData.some((d) => d.amount > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-slate-800/60 bg-linear-to-br from-slate-800/50 to-slate-900/50 p-5 shadow-xl backdrop-blur-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Spending Pulse</h3>
          <p className="text-xs text-slate-500">Last 7 days</p>
        </div>
        <div className="rounded-xl bg-indigo-500/15 p-2">
          <TrendingUp size={16} className="text-indigo-400" strokeWidth={2} />
        </div>
      </div>

      <div className="h-52">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#spendingGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#6366f1", stroke: "#0f172a", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500">No spending data for the past 7 days</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SpendingChart;
