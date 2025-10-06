import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

import authRoutes from "./routes/auth.js"; 

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Use the single router for all your API endpoints
app.use("/api", authRoutes);

// Start the server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});