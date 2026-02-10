/**
 * BottomNav.jsx — Mobile bottom navigation bar
 * 
 * Visible only on mobile (md:hidden).
 * Provides quick access to Dashboard, Add, and Transactions tabs.
 */

import { LayoutDashboard, PlusCircle, ScanLine, Receipt } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "add", label: "Add", icon: PlusCircle },
  { id: "scan", label: "Scan", icon: ScanLine },
  { id: "transactions", label: "History", icon: Receipt },
];

const BottomNav = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800/60 bg-slate-950/95 backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs font-medium transition-all ${
                isActive ? "text-indigo-400" : "text-slate-500"
              }`}
            >
              <item.icon
                size={20}
                strokeWidth={2}
                className={isActive ? "text-indigo-400" : "text-slate-500"}
              />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
