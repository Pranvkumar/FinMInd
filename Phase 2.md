[SECTION 1: THE TASK]

We are moving to Phase 2 of FinMind: Core Transactions & AI Categorization.
The goal is to allow users to record expenses and have the AI automatically categorize them.

Requirements:

Database Update: Update schema.prisma to include:

Category model: id, name (e.g., Food, Transport), icon.

Transaction model: id, amount (Decimal), description, date, userId, categoryId, isAIIdentified (Boolean).

AI Integration: - Create a gemini.service.js in the backend using @google/generative-ai.

Create a function classifyTransaction(description) that sends the merchant name/description to Gemini and returns a matching category from our database.

API Endpoints:

POST /api/transactions: Should accept amount and description. It must call the AI service to find the category before saving to the DB.

GET /api/transactions: Fetch user transactions with category details.

Frontend UI:

A simple "Add Expense" form (Amount, Description).

A "Transaction List" showing the amount, description, and the AI-generated category.

[SECTION 2: BACKGROUND & CONTEXT]

Tech Stack: Node.js, Prisma, PostgreSQL, React, Gemini API.

Reference: Use the AuthContext from Phase 1 to ensure transactions are saved to the correct userId.

AI Logic: Use a prompt for Gemini like: "Categorize this transaction: [Description]. Choose from: Food, Rent, Entertainment, Transport, Utilities, Other. Return ONLY the category name."

[SECTION 3: THE "DO NOT" LIST]

DO NOT hardcode the Gemini API Key. Use .env.

DO NOT save the transaction if the AI fails; implement a fallback to "Other" or "Uncategorized".

DO NOT use floating-point numbers for money; use Prisma's Decimal type to avoid rounding errors.

DO NOT build the charts yet; just the list and the form.

[NEXT STEP]

Show me the updated schema.prisma first, then the gemini.service.js implementation.