import express from "express";
import db from "../db.js";

const router = express.Router();

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = $1", [email], (err, result) => {
    if (err) return res.status(500).json({ success: false });

    const user = result.rows[0];
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Remove password before sending
    const { password: _, ...safeUser } = user;

    res.json({ success: true, user: safeUser });
  });
});

// Get user by ID
router.get("/users/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM users WHERE id = $1", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false });
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });

    const { password: _, ...user } = result.rows[0];
    res.json(user);
  });
});
router.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    const safeUsers = result.rows.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    res.json(safeUsers);
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = $1", [email], (err, result) => {
    if (err) return res.status(500).json({ success: false });

    const user = result.rows[0];
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  });
});

export default router;
