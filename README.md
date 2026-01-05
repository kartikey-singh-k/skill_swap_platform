# 🔄 Skill Swap Platform

A full-stack **PERN** (PostgreSQL, Express, React, Node.js) web application that facilitates **peer-to-peer skill exchange**. Users can create profiles, list skills they offer or want, and manage skill swap requests in real time.

---

## 🚀 Key Features

* **User Authentication**
  Secure registration and login using **JWT (JSON Web Tokens)** and **bcrypt** for password hashing.

* **Profile Management**
  Dynamic user profiles where users can list skills, set availability, and toggle profile visibility (**Public / Private**).

* **Request System**
  Interactive workflow to send, receive, accept, or reject skill swap requests.

* **Security Best Practices**

  * Parameterized queries to prevent **SQL Injection**
  * Backend authorization checks to prevent **IDOR (Insecure Direct Object Reference)** attacks

* **Optimistic UI**
  Instant UI updates for actions (e.g., accepting a request) to provide a smooth and responsive user experience.

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* React Router v6
* CSS3

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Authentication

* JWT (JSON Web Tokens)
* LocalStorage session handling

---

## ⚙️ Installation & Setup

Follow the steps below to run the project locally.

### 1️⃣ Database Setup

1. Ensure **PostgreSQL** is running.
2. Create a database named:

   ```sql
   CREATE DATABASE skills;
   ```
3. Run the SQL script located in `database.sql` (or manually create the required tables such as `users` and `requests`).

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

* Configure `db.js` with your PostgreSQL credentials.

Start the backend server:

```bash
node server.js
```

The backend will run at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

## 🔮 Future Improvements

* Real-time chat integration using **Socket.io**
* Advanced skill-based search and filtering
* User rating and review system

---

## 📌 Notes

* This project follows a **RESTful API architecture**.
* Designed with scalability and security best practices in mind.
* Suitable for showcasing **full-stack development**, **authentication**, and **database security concepts**.

---
