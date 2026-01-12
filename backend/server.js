require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const marksRoutes = require("./routes/marks");

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB with environment variable (Atlas cluster only - no local fallback)
const DB_URI = process.env.MONGODB_URI;

// Ensure MONGODB_URI is set
if (!DB_URI) {
  console.error("MONGODB_URI environment variable is required");
  process.exit(1);
}

mongoose.connect(DB_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

app.use("/api/auth", authRoutes);
app.use("/api/marks", marksRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
