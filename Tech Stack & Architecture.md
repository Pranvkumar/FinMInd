Finance App: Recommended Tech Stack & Architecture

To achieve a "Level 3" result following the Code Sloth methodology, we need a stack that is industry-standard, secure, and highly compatible with AI integration.

1. The "Robust" Tech Stack

Layer
Technology
Reason for Choice

Frontend
React (Vite)
Fast development, massive ecosystem, and excellent for complex state management (finances).

Styling
Tailwind CSS
Rapid UI development with a professional look. Built-in responsive utilities.

Backend
Node.js (Express)
Non-blocking I/O is great for handling many small transaction requests. Large community.

Database
PostgreSQL
Essential for Finance. Relational DBs ensure ACID compliance (your money data won't get corrupted).

ORM
Prisma
Provides type-safety and makes database migrations/management incredibly easy in VS Code.

Auth
JWT + Bcrypt
Standard for secure, stateless authentication.

AI/ML
Google Gemini API
Superior at reasoning for "Financial Coaching" and easy to integrate via the SDK.

2. Project Structure (The SLOTH Layout)

This structure ensures that as your project grows from a simple login to a complex AI assistant, the code remains modular and easy to debug.

finance-manager/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── api/            # Axios instances and API calls
│   │   ├── components/     # UI components (Buttons, Cards, Inputs)
│   │   ├── context/        # AuthContext, ExpenseContext (Global State)
│   │   ├── hooks/          # Custom hooks (useAuth, useExpenses)
│   │   ├── pages/          # Dashboard, Login, Register, Analysis
│   │   └── utils/          # Formatting currency, dates, etc.
│   └── tailwind.config.js
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Route logic (authController.js, expenseController.js)
│   │   ├── middleware/     # Auth guards, Error handlers
│   │   ├── routes/         # API endpoint definitions
│   │   ├── services/       # AI Logic & third-party integrations (Gemini)
│   │   └── index.js        # Server entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database Models (User, Transaction, Budget)
│   └── .env                # Secrets (DB_URL, JWT_SECRET, GEMINI_API_KEY)
│
└── .cursorrules            # The AI Instructions (Memory file)


3. Why this is the "Best" for your project

Financial Integrity: Using PostgreSQL over NoSQL (like MongoDB) prevents "phantom" transactions. If a user saves an expense, it either fully saves or it doesn't; there is no middle ground.

Scalable AI: By putting the Gemini logic in a dedicated services/ folder on the backend, you keep your frontend lightweight. The backend acts as a "brain" that cleans data before sending it to the AI.

Modern Auth: The "Double Token" (Access/Refresh) strategy is what professional apps use. It prevents users from being logged out constantly while keeping the session highly secure.

4. Initial Setup Commands

Run these in your VS Code terminal to get started:

# Initialize Backend
mkdir server && cd server
npm init -y
npm install express jsonwebtoken bcrypt dotenv cors prisma @prisma/client
npx prisma init

# Initialize Frontend
cd ..
npm create vite@latest client -- --template react
cd client
npm install axios lucide-react react-router-dom
