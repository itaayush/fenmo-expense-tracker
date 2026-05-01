# Resilient Expense Tracker

A production-ready, full-stack expense tracking application built with Node.js, Express, SQLite, and React (Vite). 

This application was engineered specifically to handle real-world edge cases like unreliable network connections, impatient users double-clicking buttons, and strict data integrity requirements for financial data[cite: 1].

## 🚀 Live Links
* **Frontend (Vercel):** `https://fenmo-expense-tracker-tawny.vercel.app/`
* **Backend API (Render):** `https://fenmo-api.onrender.com`
* *(Note: Render free tier spins down after inactivity. The first API request may take up to 50 seconds to wake the server).*

---

## 🧠 Key Design Decisions

**1. Money Handling (Integer Math)**
* **Problem:** Using floating-point numbers (`float` or `double`) for currency leads to rounding errors (`0.1 + 0.2 = 0.30000000000000004`).
* **Solution:** The backend database strictly stores the `amount` as an **integer representing cents**[cite: 1]. The React frontend handles the presentation logic, multiplying user input by 100 before POSTing, and dividing by 100 when displaying the data.

**2. Network Resilience & Idempotency**
* **Problem:** Unreliable networks or users mashing the "Submit" button can result in duplicate expense entries[cite: 1].
* **Solution:** Implemented **Idempotency Keys**. The frontend generates a UUID (`x-idempotency-key`) when the form mounts and sends it in the request headers. The backend verifies this key against the SQLite database. If a user retries a request that has already succeeded, the backend safely returns the existing record (Status 200) instead of creating a duplicate (Status 201).

**3. Persistence Choice: SQLite**
* I chose **SQLite** for the database[cite: 1]. 
* **Why:** It provides the strict schema enforcement and ACID compliance necessary for financial data (unlike a basic JSON file), while remaining zero-configuration. This ensures reviewers can clone and run the project instantly without needing to spin up a Dockerized PostgreSQL container.

---

## ⚖️ Trade-offs & Timebox Constraints

* **Styling & UI:** I opted for raw, semantic CSS rather than bringing in heavy component libraries like Material-UI or Tailwind. This kept the bundle size minimal and allowed me to dedicate the timebox strictly to API resilience, edge cases, and state management[cite: 1].
* **Testing:** Due to the timebox constraint, I prioritized robust API validation and error handling logic over writing a full automated test suite[cite: 1]. 

## 🚫 Intentionally Omitted Features

* **Update / Delete Endpoints:** I strictly scoped the API to `POST /expenses` and `GET /expenses`[cite: 1]. Building reliable ingestion (idempotency) and retrieval (filtering/sorting) was prioritized over full CRUD functionality[cite: 1].
* **Authentication:** User authentication and multi-tenancy were omitted to focus entirely on the core data correctness requirements[cite: 1].

---

## 🛠️ Local Development Setup

**1. Clone the repository:**
\`\`\`bash
git clone https://github.com/itaayush/fenmo-expense-tracker.git
cd fenmo-expense-tracker
\`\`\`

**2. Start the Backend:**
\`\`\`bash
cd backend
npm install
node src/server.js
\`\`\`
*(The server will run on http://localhost:3000 and automatically initialize the SQLite database on start).*

**3. Start the Frontend:**
Open a new terminal tab:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*(The Vite app will run on http://localhost:5173).*