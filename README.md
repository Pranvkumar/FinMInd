# FinMind 💰

AI-powered personal finance manager with receipt scanning, smart categorization, and financial coaching.

🔗 **Live Demo:** [https://finmind-client.onrender.com](https://finmind-client.onrender.com)

![Node.js](https://img.shields.io/badge/Node.js-Express_v5-339933?logo=node.js)
![React](https://img.shields.io/badge/React_19-Vite_7-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)

## Features

- **Smart Categorization** — Transactions are auto-categorized using AI (Groq LLama 3.3 70B) with a local keyword cache for instant zero-token matching
- **Receipt Scanning** — Upload receipts or screenshots and extract multiple transactions using vision AI (Llama 4 Scout)
- **AI Financial Coach** — Chat with an AI assistant that understands your spending patterns and gives personalized advice
- **Dashboard & Charts** — Visual spending breakdown with interactive charts, stat cards, and transaction history
- **Secure Auth** — JWT double-token system (access + httpOnly refresh cookie) with auto-refresh
- **Mobile Responsive** — Bottom navigation on mobile, sidebar on desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Node.js, Express v5, Prisma v5 |
| **Database** | MongoDB Atlas |
| **AI** | Groq API — Llama 3.3 70B (text), Llama 4 Scout (vision) |
| **Auth** | JWT (access token + httpOnly secure refresh cookie) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Groq API key ([console.groq.com](https://console.groq.com))

### 1. Clone & Install

```bash
git clone https://github.com/Pranvkumar/FinMInd.git
cd FinMInd

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your values:

```env
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/finmind?retryWrites=true&w=majority"
JWT_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
GROQ_API_KEY="gsk_..."
```

### 3. Generate Prisma Client & Seed Categories

```bash
cd server
npx prisma generate
node prisma/seed.js
```

### 4. Run

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deployment (Render)

This project includes a `render.yaml` blueprint for one-click deployment:

1. Push to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect the repo — Render auto-detects `render.yaml`
4. Set the required env vars: `DATABASE_URL` and `GROQ_API_KEY`
5. After deploy, update `CLIENT_URL` on the API service and `VITE_API_URL` on the static site with the actual URLs

## Project Structure

```
FinMind/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # Axios instance with auth interceptors
│   │   ├── components/     # UI components (Chat, Scan, Charts, etc.)
│   │   ├── context/        # Auth context provider
│   │   ├── pages/          # Landing, Login, Dashboard
│   │   └── utils/          # Chart helpers
│   └── vite.config.js
├── server/                 # Express backend
│   ├── prisma/             # Schema & seed script
│   └── src/
│       ├── controllers/    # Auth, Transaction, Receipt, Chat
│       ├── middleware/      # Auth guard, error handler
│       ├── routes/         # API route definitions
│       └── services/       # AI services (Groq), category cache
└── render.yaml             # Render deployment blueprint
```

## License

MIT
