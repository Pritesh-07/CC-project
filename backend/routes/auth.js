const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("LOGIN ATTEMPT:", email, role ? `(${role})` : '');

    const user = await User.findOne({ email });
    console.log("USER FROM DB:", user ? "Found" : "Not found");

    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (role && user.role !== role) {
      console.log("ROLE MISMATCH: Expected", role, "Got", user.role);
      return res.status(400).json({ error: "Invalid credentials for this role" });
    }

    const valid = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", valid);

    if (!valid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );
    
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ 
      user: userWithoutPassword, 
      token,
      message: "Login successful" 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ...existing code...

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    console.log("Registration attempt:", { name, email, role, department });

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password, and role are required" });
    }

    // Check if user already exists (case-insensitive email check)
    const existingUser = await User.findOne({ 
      email: { $regex: new RegExp("^" + email + "$", "i") }
    });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Validate role
    if (!['faculty', 'student'].includes(role)) {
      return res.status(400).json({ error: "Role must be either 'faculty' or 'student'" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object with conditional department field
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role
    };

    // Add department only if provided (for faculty)
    if (department && role === 'faculty') {
      userData.department = department.trim();
    }

    const user = new User(userData);
    await user.save();

    console.log("✅ User registered successfully:", user.email);
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );
    
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ 
      message: "User registered successfully", 
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error("❌ Registration error:", error);
    
    if (error.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});


router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); 
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/students", authenticateToken, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }, { password: 0 });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});


router.get("/my-students/:facultyId", authenticateToken, async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    // Ensure the requesting user can only access their own students
    if (req.user.id.toString() !== facultyId.toString()) {
      return res.status(403).json({ error: "Access forbidden: Cannot access other faculty's students" });
    }
    
    const students = await User.find({ role: "student", facultyId }, { password: 0 });
    res.json(students);
  } catch (error) {
    console.error("Error fetching faculty students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});


router.post("/register-student", authenticateToken, async (req, res) => {
  try {
    const { name, email, password, facultyId } = req.body;

    if (!name || !email || !password || !facultyId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Student already exists" });
    }

    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== "faculty") {
      return res.status(400).json({ error: "Invalid faculty ID" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new User({
      name,
      email,
      password: hashedPassword,
      role: "student",
      facultyId
    });

    await student.save();
    
    const token = jwt.sign(
      { id: student._id, email: student.email, role: student.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );
    
    const { password: _, ...studentWithoutPassword } = student.toObject();
    res.json({ 
      student: studentWithoutPassword, 
      token,
      message: "Student registered successfully" 
    });
  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
