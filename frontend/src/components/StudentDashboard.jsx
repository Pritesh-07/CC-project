import api from "../utils/api";
import { useEffect, useState } from "react";

export default function StudentDashboard({ user }) {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    api.get(`/marks/student/${user._id}`)
      .then(res => setMarks(res.data));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  const totalMarks = marks.reduce((sum, m) => sum + m.marks, 0);
  const averageMarks = marks.length > 0 ? (totalMarks / marks.length).toFixed(2) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h2>Welcome, {user.name}</h2>
          <p className="user-role">Student Dashboard</p>
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="marks-section">
        <h3>Academic Performance</h3>
        
        {marks.length > 0 ? (
          <>
            <div className="marks-table-container">
              <table className="marks-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Marks</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map(m => (
                    <tr key={m._id}>
                      <td className="course-code">{m.course}</td>
                      <td className="marks-score">{m.marks}/100</td>
                      <td>
                        <span className={`grade-badge grade-${m.grade}`}>
                          {m.grade}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${m.marks >= 50 ? 'pass' : 'fail'}`}>
                          {m.marks >= 50 ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="performance-summary">
              <div className="summary-card">
                <h4>Total Courses</h4>
                <span className="summary-value">{marks.length}</span>
              </div>
              <div className="summary-card">
                <h4>Total Marks</h4>
                <span className="summary-value">{totalMarks}/{marks.length * 100}</span>
              </div>
              <div className="summary-card">
                <h4>Average</h4>
                <span className="summary-value">{averageMarks}%</span>
              </div>
              <div className="summary-card">
                <h4>Overall Grade</h4>
                <span className={`summary-value grade-${
                  averageMarks >= 90 ? 'S' :
                  averageMarks >= 80 ? 'A' :
                  averageMarks >= 70 ? 'B' :
                  averageMarks >= 60 ? 'C' :
                  averageMarks >= 50 ? 'D' : 'F'
                }`}>
                  {averageMarks >= 90 ? 'S' :
                   averageMarks >= 80 ? 'A' :
                   averageMarks >= 70 ? 'B' :
                   averageMarks >= 60 ? 'C' :
                   averageMarks >= 50 ? 'D' : 'F'}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="no-marks">
            <p>No marks available yet.</p>
            <small>Your marks will appear here once faculty adds them.</small>
          </div>
        )}
      </div>
    </div>
  );
}
