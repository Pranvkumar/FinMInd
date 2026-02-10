/**
 * Dashboard.jsx — Professional-grade dashboard
 * 
 * Layout: Sidebar (desktop) + BottomNav (mobile)
 * Hero: 3 StatCards (Balance, Income placeholder, Expense)
 * Content: SpendingChart, tabbed views (dashboard / add / transactions)
 */

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Wallet, TrendingDown, TrendingUp, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

import Sidebar from "../components/navigation/Sidebar";
import BottomNav from "../components/navigation/BottomNav";
import StatCard from "../components/ui/StatCard";
import Skeleton from "../components/ui/Skeleton";
import SpendingChart from "../components/SpendingChart";
import AddExpense from "../components/AddExpense";
import ScanUpload from "../components/ScanUpload";
import TransactionList from "../components/TransactionList";
import ChatSidebar from "../components/ChatSidebar";
import { getMonthlyExpense, formatCurrency } from "../utils/chartHelpers";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // ── Fetch transactions on mount ──────────────
  const fetchTransactions = async () => {
    try {
      const { data } = await api.get("/transactions");
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ── Handlers ─────────────────────────────────
  const handleTransactionAdded = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    // Auto-switch to dashboard after adding
    setActiveTab("dashboard");
  };

  const handleTransactionDeleted = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  // ── Computed stats ───────────────────────────
  const totalSpent = transactions.reduce(
    (sum, tx) => sum + parseFloat(tx.amount),
    0
  );
  const monthlyExpense = getMonthlyExpense(transactions);
  const txCount = transactions.length;

  // ── Tab content renderer ─────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case "add":
        return (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <AddExpense onTransactionAdded={handleTransactionAdded} />
          </motion.div>
        );

      case "scan":
        return (
          <motion.div
            key="scan"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <ScanUpload onTransactionAdded={handleTransactionAdded} />
          </motion.div>
        );

      case "transactions":
        return (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200">
                All Transactions
              </h2>
              <span className="text-xs text-slate-500">
                {txCount} {txCount === 1 ? "entry" : "entries"}
              </span>
            </div>
            {loading ? (
              <Skeleton count={5} className="h-14 rounded-xl" />
            ) : (
              <TransactionList
                transactions={transactions}
                onTransactionDeleted={handleTransactionDeleted}
              />
            )}
          </motion.div>
        );

      default:
        // Dashboard overview
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Stat cards */}
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  title="Total Spent"
                  value={formatCurrency(totalSpent)}
                  icon={Wallet}
                  trendLabel={`${txCount} transactions`}
                />
                <StatCard
                  title="This Month"
                  value={formatCurrency(monthlyExpense)}
                  icon={TrendingDown}
                  variant="expense"
                  trendLabel="Monthly expenses"
                />
                <StatCard
                  title="Avg per Txn"
                  value={
                    txCount > 0
                      ? formatCurrency(totalSpent / txCount)
                      : "₹0"
                  }
                  icon={TrendingUp}
                  variant="income"
                  trendLabel="Per transaction"
                />
              </div>
            )}

            {/* Spending chart */}
            {loading ? (
              <Skeleton className="h-72 rounded-2xl" />
            ) : (
              <SpendingChart transactions={transactions} />
            )}

            {/* Recent transactions */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">
                  Recent Transactions
                </h2>
                {txCount > 5 && (
                  <button
                    onClick={() => setActiveTab("transactions")}
                    className="text-xs text-indigo-400 transition-colors hover:text-indigo-300"
                  >
                    View all →
                  </button>
                )}
              </div>
              {loading ? (
                <Skeleton count={3} className="h-14 rounded-xl" />
              ) : (
                <TransactionList
                  transactions={transactions.slice(0, 5)}
                  onTransactionDeleted={handleTransactionDeleted}
                />
              )}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDataCleared={() => {
          setTransactions([]);
          setActiveTab("dashboard");
        }}
        mobileOpen={showMobileMenu}
        onMobileClose={() => setShowMobileMenu(false)}
      />

      {/* Main content area */}
      <main className="flex-1 pb-20 md:pb-0 md:pl-64">
        {/* Top greeting bar (mobile-visible) */}
        <header className="sticky top-0 z-10 border-b border-slate-800/60 bg-slate-950/80 px-4 py-4 backdrop-blur-md md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger menu */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
              >
                <Menu size={20} strokeWidth={2} />
              </button>
              <div>
                <h1 className="text-lg font-bold text-slate-100">
                  {activeTab === "dashboard"
                    ? "Dashboard"
                    : activeTab === "add"
                    ? "Add Expense"
                    : activeTab === "scan"
                    ? "Scan Receipt"
                    : "Transactions"}
                </h1>
                <p className="text-xs text-slate-500">
                  Welcome back, {user?.email?.split("@")[0]}
                </p>
              </div>
            </div>

            {/* Quick-add button on desktop */}
            {activeTab !== "add" && (
              <button
                onClick={() => setActiveTab("add")}
                className="hidden items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 md:flex"
              >
                + Add Expense
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* AI Chat Sidebar */}
      <ChatSidebar />
    </div>
  );
};

export default Dashboard;
