/**
 * EmptyState.jsx — Shown when there's no data to display
 * 
 * Provides a clean illustration with a call-to-action.
 */

import { motion } from "framer-motion";

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {Icon && (
        <div className="mb-4 rounded-2xl bg-slate-800/60 p-5">
          <Icon size={40} strokeWidth={1.5} className="text-slate-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-300">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
