Finance App Development Roadmap

"If you can't break it down, you don't understand the problem." — Code Sloth

Phase 1: Authentication (Robust & Secure)

[ ] Initialize Express & Vite project folders.

[ ] Set up PostgreSQL with Prisma.

[ ] Implement JWT with Refresh/Access token rotation.

[ ] Create AuthContext in React.

Phase 2: Core Records & UI

[ ] Create Transaction Schema (Amount, Date, Category, Note).

[ ] Build Dashboard UI (Income vs Expense summary).

[ ] Implement CRUD for manual expense entry.

Phase 3: AI Categorization ("Intelligence")

[ ] Integrate Gemini API.

[ ] Create a script to auto-assign categories (Food, Rent, etc.) based on transaction description.

[ ] Implement "Correction Mode" for users to train the AI.

Phase 4: Analytics & Baselines

[ ] Build Weekly/Monthly aggregation logic in the backend.

[ ] Create Chart.js or Recharts visualizations.

[ ] Implement user-defined spending limits (Baselines).

Phase 5: The Financial Coach

[ ] Build a floating Chatbot UI.

[ ] Feed user spending data into Gemini to provide actionable advice (e.g., "You spent 20% more on coffee this week").