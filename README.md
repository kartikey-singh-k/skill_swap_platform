# 🔄 Skill Swap Platform

A full-stack PERN (PostgreSQL, Express, React, Node.js) web application that facilitates peer-to-peer skill exchange. Users can create profiles, list skills they offer/want, and manage swap requests in real-time.

## 🚀 Key Features

* **User Authentication:** Secure registration and login using **JWT (JSON Web Tokens)** and **bcrypt** for password hashing.
* **Profile Management:** Dynamic user profiles where users can list skills, availability, and toggle profile visibility (Public/Private).
* **Request System:** Interactive workflow to send, receive, and accept skill swap requests.
* **Security Best Practices:** Implemented **Parameterized Queries** to prevent SQL Injection and backend validation to prevent IDOR attacks.
* **Optimistic UI:** Instant UI updates for action buttons (e.g., Accepting a request) for a seamless user experience.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), React Router v6, CSS3
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Authentication:** JWT, LocalStorage handling

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Database Setup
Ensure PostgreSQL is running and create a database named `skills`.
Run the SQL script located in `database.sql` (or create tables for `users` and `requests`).

### 2. Backend Setup
```bash```
cd server
Server runs on http://localhost:5000

3. Frontend Setup
Bash
# Open a new terminal
cd client
npm install
npm run dev
Client runs on http://localhost:5173

🔮 Future Improvements
Integration of a real-time chat via Socket.io.

Advanced filtering and search for specific skills.

User rating and review system.
npm install
# Configure your db.js with your Postgres credentials
node server.js
