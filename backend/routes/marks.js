const express = require("express");
const Marks = require("../models/Marks");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { studentEmail, course, marks, grade } = req.body;
    
    if (!studentEmail || !course || marks === undefined || !grade) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const User = require("../models/User");
    const student = await User.findOne({ email: studentEmail, role: "student" });
    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }
    
    if (typeof marks !== 'number' || marks < 0 || marks > 100) {
      return res.status(400).json({ error: "Marks must be a number between 0 and 100" });
    }
    

    if (!['S', 'A', 'B', 'C', 'D', 'F'].includes(grade)) {
      return res.status(400).json({ error: "Grade must be one of: S, A, B, C, D, F" });
    }

    const existingMarks = await Marks.findOne({ 
      studentId: student._id, 
      course: course 
    });

    if (existingMarks) {
      existingMarks.marks = marks;
      existingMarks.grade = grade;
      await existingMarks.save();
      res.json({ message: "Marks updated successfully", data: existingMarks });
    } else {
      const marksData = new Marks({
        studentId: student._id,
        course,
        marks,
        grade
      });
      
      await marksData.save();
      res.json({ message: "Marks added successfully", data: marksData });
    }
  } catch (error) {
    console.error("Error adding/updating marks:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation error: " + error.message });
    }
    res.status(500).json({ error: "Failed to add/update marks" });
  }
});

router.get("/student/:id", async (req, res) => {
  try {
    const data = await Marks.find({ studentId: req.params.id });
    res.json(data);
  } catch (error) {
    console.error("Error fetching student marks:", error);
    res.status(500).json({ error: "Failed to fetch marks" });
  }
});

router.get("/stats/:course", async (req, res) => {
  try {
    const marks = await Marks.find({ course: req.params.course });

    if (marks.length === 0) {
      return res.json({ avg: 0, grades: { S:0, A:0, B:0, C:0, D:0, F:0 } });
    }

    const avg = marks.reduce((a, b) => a + b.marks, 0) / marks.length;

    const grades = { S:0, A:0, B:0, C:0, D:0, F:0 };
    marks.forEach(m => grades[m.grade]++);

    res.json({ avg: Math.round(avg * 100) / 100, grades });
  } catch (error) {
    console.error("Error fetching course stats:", error);
    res.status(500).json({ error: "Failed to fetch course statistics" });
  }
});

router.get("/faculty-stats/:course/:facultyId", async (req, res) => {
  try {
    const { course, facultyId } = req.params;
  
    const User = require("../models/User");
    const students = await User.find({ role: "student", facultyId });
    const studentIds = students.map(s => s._id);
    
    const marks = await Marks.find({ 
      course: course, 
      studentId: { $in: studentIds }
    });

    if (marks.length === 0) {
      return res.json({ 
        avg: 0, 
        grades: { S:0, A:0, B:0, C:0, D:0, F:0 },
        totalStudents: students.length,
        studentsWithMarks: 0
      });
    }

    const avg = marks.reduce((a, b) => a + b.marks, 0) / marks.length;

    const grades = { S:0, A:0, B:0, C:0, D:0, F:0 };
    marks.forEach(m => grades[m.grade]++);

    res.json({ 
      avg: Math.round(avg * 100) / 100, 
      grades,
      totalStudents: students.length,
      studentsWithMarks: marks.length
    });
  } catch (error) {
    console.error("Error fetching faculty course stats:", error);
    res.status(500).json({ error: "Failed to fetch faculty course statistics" });
  }
});

module.exports = router;
