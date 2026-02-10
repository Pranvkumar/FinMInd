[SECTION 1: THE TASK]

Upgrade the FinMind frontend to a professional-grade dashboard. We want the user to feel like they are using a high-end FinTech app.

Key UI Components to Build:

The Hero Dashboard:

Three "Quick Stat" cards: Total Balance, Monthly Income, Monthly Expense (use Glassmorphism).

A "Spending Pulse" chart: A simple Area Chart using recharts to show spending over the last 7 days.

AI Scanning Hub:

A dedicated "Scan & Save" section with a drag-and-drop file uploader.

A "Live Preview" modal that shows the uploaded receipt on the left and the AI-extracted fields on the right.

Smart Transaction List:

Group transactions by "Today," "Yesterday," and "Earlier this month."

Every transaction should have a colored category icon (e.g., Food = Orange, Transport = Blue).

Navigation:

A sleek sidebar (desktop) and a bottom-nav bar (mobile) for easy access.

[SECTION 2: BACKGROUND & CONTEXT]

Tech Stack: React, Tailwind CSS, Recharts, Framer Motion (for animations), Lucide-React.

AI Context: Ensure the "AI Processing" state has a distinct animation (like a scanning light effect over the receipt).

Modularity: Keep UI components in client/src/components/ui.

[SECTION 3: THE "DO NOT" LIST]

DO NOT use default HTML tables; use div based lists for better mobile responsiveness.

DO NOT use harsh, solid borders; prefer subtle border-slate-200/50 or shadows.

DO NOT clutter the screen; maintain generous whitespace (padding/margin).

DO NOT hardcode the chart data; create a helper function to format the transaction history for Recharts.

[NEXT STEP]

Start by creating the DashboardLayout.jsx and the StatCard.jsx components. Then, implement the recharts integration for the spending graph.