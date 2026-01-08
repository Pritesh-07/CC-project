const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    required: true,
    enum: ['S', 'A', 'B', 'C', 'D', 'F']
  }
});

module.exports = mongoose.model("Marks", MarksSchema);
