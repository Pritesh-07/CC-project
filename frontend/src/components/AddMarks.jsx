import axios from "axios";
import { useState, useEffect } from "react";

export default function AddMarks({ user }) {
  const [data, setData] = useState({
    studentEmail: '',
    course: '',
    marks: '',
    grade: ''
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?._id) {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/auth/my-students/${user._id}`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students list");
    }
  };

  const submit = async () => {
    setError('');
    
    if (!data.studentEmail || !data.course || !data.marks || !data.grade) {
      setError('All fields are required');
      return;
    }

    const marksNum = parseFloat(data.marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      setError('Marks must be a number between 0 and 100');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/api/marks/add", {
        studentEmail: data.studentEmail,
        course: data.course,
        marks: marksNum,
        grade: data.grade
      });
      alert(response.data.message || "Marks processed successfully!");
      setData({
        studentEmail: '',
        course: '',
        marks: '',
        grade: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-marks-section">
       <h3>Add/Update Student Marks</h3>
       {error && <div className="error-message">{error}</div>}
       
       {students.length === 0 && !error && (
         <div className="info-message">
           <p>You haven't registered any students yet.</p>
           <p>Please go to the "My Students" tab to register students first.</p>
         </div>
       )}
       
       {students.length > 0 && (
       <div className="form-grid">
         <div className="form-group">
           <label>Student</label>
           <select 
             value={data.studentEmail}
             onChange={e => setData({...data, studentEmail: e.target.value})}
             disabled={loading}
           >
             <option value="">Select Student</option>
             {students.map(student => (
               <option key={student._id} value={student.email}>
                 {student.name} ({student.email})
               </option>
             ))}
           </select>
         </div>

         <div className="form-group">
           <label>Course</label>
           <select 
             value={data.course}
             onChange={e => setData({...data, course: e.target.value})}
             disabled={loading}
           >
             <option value="">Select Course</option>
             <option value="C1">Course 1 (C1)</option>
             <option value="C2">Course 2 (C2)</option>
             <option value="C3">Course 3 (C3)</option>
           </select>
         </div>

         <div className="form-group">
           <label>Marks (0-100)</label>
           <input 
             type="number"
             min="0"
             max="100"
             value={data.marks}
             onChange={e => setData({...data, marks: e.target.value})}
             disabled={loading}
             placeholder="Enter marks"
           />
         </div>
         
         <div className="form-group">
           <label>Grade</label>
           <select 
             value={data.grade}
             onChange={e => setData({...data, grade: e.target.value})}
             disabled={loading}
           >
             <option value="">Select Grade</option>
             <option value="S">S (90-100)</option>
             <option value="A">A (80-89)</option>
             <option value="B">B (70-79)</option>
             <option value="C">C (60-69)</option>
             <option value="D">D (50-59)</option>
             <option value="F">F (0-49)</option>
           </select>
         </div>
       </div>
       )}
       
       {students.length > 0 && (
       <button className="submit-btn" onClick={submit} disabled={loading}>
         {loading ? "Processing..." : "Add/Update Marks"}
       </button>
       )}
    </div>
  );
}
