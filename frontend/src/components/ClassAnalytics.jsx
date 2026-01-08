import axios from "axios";
import { useState, useEffect } from "react";

export default function ClassAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    'C1': null,
    'C2': null,
    'C3': null
  });
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('C1');

  const user = JSON.parse(localStorage.getItem("user"));
  const courses = [
    { code: 'C1', name: 'Mathematics' },
    { code: 'C2', name: 'Physics' },
    { code: 'C3', name: 'Chemistry' }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const promises = courses.map(course => 
        axios.get(`http://localhost:3001/api/marks/faculty-stats/${course.code}/${user._id}`)
      );
      
      const results = await Promise.all(promises);
      
      const newData = {};
      courses.forEach((course, index) => {
        newData[course.code] = results[index].data;
      });
      
      setAnalyticsData(newData);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'S': '#27ae60',
      'A': '#3498db',
      'B': '#9b59b6',
      'C': '#f39c12',
      'D': '#e67e22',
      'F': '#e74c3c'
    };
    return colors[grade] || '#95a5a6';
  };

  if (loading) {
    return (
      <div className="analytics-section">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading class analytics...</p>
        </div>
      </div>
    );
  }

  const currentData = analyticsData[selectedCourse];

  return (
    <div className="analytics-section">
      <div className="section-header">
        <h3>Class Performance Analytics</h3>
        <p>View detailed statistics for each course</p>
      </div>

      <div className="course-tabs">
        {courses.map(course => (
          <button
            key={course.code}
            className={`course-tab ${selectedCourse === course.code ? 'active' : ''}`}
            onClick={() => setSelectedCourse(course.code)}
          >
            <span className="course-code">{course.code}</span>
            <span className="course-name">{course.name}</span>
          </button>
        ))}
      </div>

      {currentData ? (
        <div className="analytics-content">
          <div className="summary-cards">
            <div className="summary-card primary">
              <h4>Total Students</h4>
              <span className="summary-value">{currentData.totalStudents || 0}</span>
            </div>
            
            <div className="summary-card success">
              <h4>Class Average</h4>
              <span className="summary-value">{currentData.avg || 0}%</span>
            </div>
            
            <div className="summary-card info">
              <h4>Pass Rate</h4>
              <span className="summary-value">
                {currentData.totalStudents > 0 
                  ? Math.round(((currentData.totalStudents - (currentData.grades?.F || 0)) / currentData.totalStudents) * 100)
                  : 0}%
              </span>
            </div>
          </div>

          <div className="grades-distribution">
            <h4>Grade Distribution</h4>
            <div className="grades-chart">
              {['S', 'A', 'B', 'C', 'D', 'F'].map(grade => {
                const count = currentData.grades?.[grade] || 0;
                const percentage = currentData.totalStudents > 0 
                  ? (count / currentData.totalStudents) * 100 
                  : 0;
                
                return (
                  <div key={grade} className="grade-bar">
                    <div className="grade-label">
                      <span className="grade-letter" style={{ color: getGradeColor(grade) }}>
                        {grade}
                      </span>
                      <span className="grade-count">{count} students</span>
                    </div>
                    <div className="grade-progress">
                      <div 
                        className="grade-fill" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: getGradeColor(grade)
                        }}
                      ></div>
                    </div>
                    <span className="grade-percentage">{percentage.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="detailed-stats">
            <div className="stat-item">
              <span className="stat-label">Students with S Grade:</span>
              <span className="stat-value grade-s">{currentData.grades?.S || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Students with A Grade:</span>
              <span className="stat-value grade-a">{currentData.grades?.A || 0}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data">
          <p>No data available for {courses.find(c => c.code === selectedCourse)?.name}</p>
          <small>Add some marks to see analytics</small>
        </div>
      )}
    </div>
  );
}
