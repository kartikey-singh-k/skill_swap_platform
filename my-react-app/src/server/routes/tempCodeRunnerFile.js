import express from "express";
import db from "../db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY_THAT_IS_LONG_AND_RANDOM';

// --- AUTHENTICATION MIDDLEWARE ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Token is not valid." });
    }
    req.user = user;
    next();
  });
};

// --- PUBLIC ROUTES ---

// POST /api/register
router.post("/register", async (req, res) => {
  const { name, email, password, location, availability, profile_type, skills_offered, skills_wanted } = req.body;
  try {
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ success: false, message: "User with this email already exists." });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await db.query(
      `INSERT INTO users (name, email, password, location, availability, profile_type, skills_offered, skills_wanted)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, email, hashedPassword, location, availability, profile_type, skills_offered, skills_wanted]
    );
    const { password: _, ...safeUser } = newUser.rows[0];
    res.status(201).json({ success: true, user: safeUser });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
});

// POST /api/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser, token: token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
});

// --- PROTECTED ROUTES ---

// GET /api/users
router.get("/users", authMiddleware, (req, res) => {
  db.query("SELECT id, name, email, location, skills_offered, skills_wanted, availability, profile_type, rating FROM users", (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json(result.rows);
  });
});

// GET /api/users/:id
router.get("/users/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  db.query("SELECT id, name, email, location, skills_offered, skills_wanted, availability, profile_type, rating FROM users WHERE id = $1", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });
    res.json(result.rows[0]);
  });
});

// ✅ NEW ROUTE TO UPDATE A USER'S PROFILE
router.put("/users/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const loggedInUserId = req.user.id;

    // Security check: Make sure the logged-in user is only updating their own profile
    if (parseInt(id, 10) !== loggedInUserId) {
        return res.status(403).json({ success: false, message: "Forbidden: You can only update your own profile." });
    }

    const { name, location, availability, profile_type, skills_offered, skills_wanted } = req.body;

    try {
        const result = await db.query(
            `UPDATE users SET name = $1, location = $2, availability = $3, profile_type = $4, skills_offered = $5, skills_wanted = $6
             WHERE id = $7 RETURNING *`,
            [name, location, availability, profile_type, skills_offered, skills_wanted, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const { password: _, ...updatedUser } = result.rows[0];
        res.json({ success: true, user: updatedUser });

    } catch (err) {
        console.error("❌ User update error:", err);
        res.status(500).json({ success: false, message: "Server error during profile update." });
    }
});


// POST /api/requests
router.post("/requests", authMiddleware, (req, res) => {
    const { toUserId, skillOffered, skillWanted, message } = req.body;
    const fromUserId = req.user.id;
    if (!fromUserId || !toUserId || !skillOffered || !skillWanted) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    db.query(
        `INSERT INTO requests (from_user_id, to_user_id, skill_offered, skill_wanted, message) VALUES ($1, $2, $3, $4, $5)`,
        [fromUserId, toUserId, skillOffered, skillWanted, message],
        (err) => {
            if (err) {
                console.error("❌ Error saving request:", err);
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.status(201).json({ success: true, message: "Request sent successfully." });
        }
    );
});

// GET /api/requests/received
router.get("/requests/received", authMiddleware, (req, res) => {
  const loggedInUserId = req.user.id;
  const query = `
    SELECT r.*, u.name as sender_name 
    FROM requests r JOIN users u ON r.from_user_id = u.id 
    WHERE r.to_user_id = $1 ORDER BY r.created_at DESC`;
  db.query(query, [loggedInUserId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, requests: result.rows });
  });
});

// PUT /api/requests/:id/accept
router.put("/requests/:id/accept", authMiddleware, (req, res) => {
  const { id } = req.params;
  const loggedInUserId = req.user.id;
  const query = `UPDATE requests SET status = 'accepted' WHERE id = $1 AND to_user_id = $2`;
  db.query(query, [id, loggedInUserId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: "Request not found or not authorized." });
    res.json({ success: true, message: "Request accepted." });
  });
});

export default router;
