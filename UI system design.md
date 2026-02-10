FinMind Design System & UI Rules

To ensure a premium, modern feel, the AI agent must follow these styling rules:

1. Visual Language

Theme: Dark/Light mode support using Tailwind's dark: classes.

Glassmorphism: Use backdrop-blur-md and bg-white/10 for cards to give a layered depth.

Color Palette:

Primary: Indigo-600 (#4f46e5) for actions.

Success: Emerald-500 (#10b981) for Income.

Danger: Rose-500 (#f43f5e) for Expenses.

Neutral: Slate-900 (Background) / Slate-50 (Text).

2. Interactive Elements

Buttons: Subtle hover:scale-105 transitions.

Cards: Rounded corners (rounded-2xl) and soft shadows (shadow-xl).

Icons: Always use lucide-react with a consistent stroke width of 2.

3. Feedback Loop

Skeleton Screens: Show gray pulsing boxes while the AI is processing receipts.

Toast Notifications: Use a library like sonner or a custom tailwind component for "Transaction Saved" alerts.

Empty States: When no transactions exist, show a clean illustration or an icon with a "Scan your first receipt" call-to-action.