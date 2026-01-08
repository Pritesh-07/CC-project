const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const marksRoutes = require("./routes/marks");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/marksDB");

app.use("/api/auth", authRoutes);
app.use("/api/marks", marksRoutes);

app.listen(3001, () => console.log("Server running on port 3001"));
