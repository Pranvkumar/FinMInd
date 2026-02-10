/**
 * Sidebar.jsx — Desktop sidebar navigation
 * 
 * Fixed left sidebar with navigation links, user info,
 * and account management (logout + delete account).
 */

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Receipt,
  ScanLine,
  LogOut,
  Trash2,
  AlertTriangle,
  X,
  Eraser,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import FinMindLogo from "../FinMindLogo";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "add", label: "Add Expense", icon: PlusCircle },
  { id: "scan", label: "Scan Receipt", icon: ScanLine },
  { id: "transactions", label: "Transactions", icon: Receipt },
];

const Sidebar = ({ activeTab, onTabChange, onDataCleared, mobileOpen, onMobileClose }) => {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      navigate("/");
    } catch (err) {
      console.error("Delete account error:", err);
      setDeleting(false);
    }
  };

  const handleClearData = async () => {
    setClearing(true);
    try {
      await api.delete("/transactions/all");
      setShowClearModal(false);
      if (onDataCleared) onDataCleared();
    } catch (err) {
      console.error("Clear data error:", err);
    } finally {
      setClearing(false);
    }
  };

  const handleTabChange = (tab) => {
    onTabChange(tab);
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/60 bg-slate-950 shadow-2xl transition-transform duration-300 ease-in-out md:z-30 md:w-64 md:shadow-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Logo + Mobile Close */}
        <div className="flex items-center justify-between px-5 py-5">
          <FinMindLogo className="h-8" />
          <button
            onClick={onMobileClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300 md:hidden"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-3 pt-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-400"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <item.icon size={18} strokeWidth={2} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User + Actions */}
        <div className="border-t border-slate-800/60 px-4 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-400">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-200">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 rounded-lg border border-slate-800/60 py-2 text-[10px] text-slate-500 transition hover:border-slate-700 hover:bg-slate-800/40 hover:text-slate-300"
              title="Sign out"
            >
              <LogOut size={13} strokeWidth={2} />
              Logout
            </button>
            <button
              onClick={() => setShowClearModal(true)}
              className="flex flex-col items-center gap-1 rounded-lg border border-amber-500/10 py-2 text-[10px] text-slate-600 transition hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
              title="Clear all data"
            >
              <Eraser size={13} strokeWidth={2} />
              Clear
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex flex-col items-center gap-1 rounded-lg border border-rose-500/10 py-2 text-[10px] text-slate-600 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
              title="Delete account"
            >
              <Trash2 size={13} strokeWidth={2} />
              Delete
            </button>
          </div>
        </div>
      </aside>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => !deleting && setShowDeleteModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-800/60 bg-slate-900 p-6 shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={() => !deleting && setShowDeleteModal(false)}
                className="absolute right-3 top-3 rounded-lg p-1 text-slate-600 transition hover:bg-slate-800 hover:text-slate-400"
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/15">
                <AlertTriangle size={22} className="text-rose-400" strokeWidth={2} />
              </div>

              <h3 className="text-base font-semibold text-slate-100">
                Delete your account?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                This will permanently delete your account, all transactions, and
                spending data. This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-slate-700/50 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-50"
                >
                  {deleting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Trash2 size={14} strokeWidth={2} />
                      Delete Forever
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Clear Data Confirmation Modal */}
      <AnimatePresence>
        {showClearModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => !clearing && setShowClearModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-800/60 bg-slate-900 p-6 shadow-2xl"
            >
              <button
                onClick={() => !clearing && setShowClearModal(false)}
                className="absolute right-3 top-3 rounded-lg p-1 text-slate-600 transition hover:bg-slate-800 hover:text-slate-400"
              >
                <X size={16} />
              </button>

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15">
                <Eraser size={22} className="text-amber-400" strokeWidth={2} />
              </div>

              <h3 className="text-base font-semibold text-slate-100">
                Clear all transactions?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                This will delete all your transaction history. Your account will remain active.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  disabled={clearing}
                  className="flex-1 rounded-xl border border-slate-700/50 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  disabled={clearing}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-50"
                >
                  {clearing ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Eraser size={14} strokeWidth={2} />
                      Clear All Data
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
