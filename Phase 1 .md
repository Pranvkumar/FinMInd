[SECTION 1: THE TASK]

I am building a finance app called FinMind . Your task is to initialize the project foundation and implement a robust Authentication system. Specifically:

Initialize the /server folder with Express and Prisma.

Initialize the /client folder with React (Vite) and Tailwind CSS.

Create a User model in schema.prisma with: id, email, password, and createdAt.

Implement a "Double Token" Auth strategy:

Access Token (JWT) sent in response body.

Refresh Token (JWT) sent in an httpOnly, Secure, SameSite=Strict cookie.

Create /register and /login endpoints.

[SECTION 2: BACKGROUND & CONTEXT]

Tech Stack: Refer to tech_stack.md for the exact folder structure and libraries.

Rules: Follow all instructions in .cursorrules (modular code, clean error handling).

Environment: We are using PostgreSQL via Prisma. Assume a .env file exists with DATABASE_URL and JWT_SECRET.

[SECTION 3: THE "DO NOT" LIST]

DO NOT put all code in index.js. Use a modular structure with /routes, /controllers, and /middleware.

DO NOT store sensitive tokens in localStorage.

DO NOT write the frontend UI components yet; focus on the AuthContext.jsx logic and the backend API first.

DO NOT use any types; ensure logic is clear and well-commented.

[NEXT STEP]

Please provide the terminal commands to set up the folders first, then show me the schema.prisma file and the Auth controller logic.