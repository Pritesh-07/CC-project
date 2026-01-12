import { useState, useEffect } from "react";
import api from "../utils/api";

export default function RegisterStudent({ user }) {
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    password: 'student123' 
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      setError('No user found. Please login again.');
      return;
    }
    if (user.role !== 'faculty') {
      setError('Access denied. Faculty access required.');
      return;
    }
    fetchMyStudents();
  }, []);

  const fetchMyStudents = async () => {
    if (!user || !user._id) return;
    
    try {
      const res = await api.get(`/auth/my-students/${user._id}`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const validateName = (name) => {

    if (!name.trim()) {
      return "Name is required";
    }
    if (/^\d+$/.test(name.trim())) {
      return "Name cannot be only numbers";
    }
    
    if (/\d/.test(name)) {
      return "Name cannot contain numbers";
    }
    
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    
    if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
      return "Name can only contain letters, spaces, hyphens, and apostrophes";
    }
    
    return null; 
  };

  const registerStudent = async () => {
    setError('');
    setSuccess('');
    
    if (!user || !user._id) {
      setError('User session expired. Please login again.');
      return;
    }
    
    if (!studentData.name || !studentData.email) {
      setError('Name and email are required');
      return;
    }

    const nameError = validateName(studentData.name);
    if (nameError) {
      setError(nameError);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        name: studentData.name.trim(),
        email: studentData.email.toLowerCase().trim(),
        password: studentData.password,
        facultyId: user._id
      };
      
      const response = await api.post("/auth/register-student", requestData);
      
      setSuccess('Student registered successfully!');
      setStudentData({ name: '', email: '', password: 'student123' });
      fetchMyStudents(); // Refresh the list
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || 'Failed to register student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-student-section">
      <div className="section-header">
        <h3>Register New Student</h3>
        <p>Add students to your class to manage their marks</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="register-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Student Name *</label>
            <input 
              type="text"
              placeholder="Enter student's full name"
              value={studentData.name}
              onChange={e => setStudentData({...studentData, name: e.target.value})}
              disabled={loading}
              maxLength="50"
            />
            <small className="field-hint"></small>
          </div>

          <div className="form-group">
            <label>Student Email *</label>
            <input 
              type="email"
              placeholder="Enter student's email address"
              value={studentData.email}
              onChange={e => setStudentData({...studentData, email: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Default Password</label>
            <input 
              type="text"
              value={studentData.password}
              onChange={e => setStudentData({...studentData, password: e.target.value})}
              disabled={loading}
            />
            <small>Students can change this password after first login</small>
          </div>
        </div>

        <button className="register-btn" onClick={registerStudent} disabled={loading}>
          {loading ? "Registering..." : "Register Student"}
        </button>
      </div>

      <div className="students-list">
        <h4>My Registered Students ({students.length})</h4>
        {students.length > 0 ? (
          <div className="students-grid">
            {students.map(student => (
              <div key={student._id} className="student-card">
                <div className="student-info">
                  <h5>{student.name}</h5>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-students">
            <p>No students registered yet.</p>
            <small>Register your first student using the form above.</small>
          </div>
        )}
      </div>
    </div>
  );
}
