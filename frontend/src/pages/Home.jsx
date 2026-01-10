import { useState } from "react";
import FacultyLogin from "../components/FacultyLogin";
import StudentLogin from "../components/StudentLogin";
import FacultyRegister from "../components/FacultyRegister";

export default function Home() {
  const [loginType, setLoginType] = useState("");

  if (loginType === "faculty") {
    return <FacultyLogin onBack={() => setLoginType("")} />;
  }
  
  if (loginType === "student") {
    return <StudentLogin onBack={() => setLoginType("")} />;
  }

  if (loginType === "facultyRegister") {
    return <FacultyRegister onBack={() => setLoginType("")} />;
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <div className="logo-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
            </svg>
          </div>
          <h1 className="home-title">Student Marks Management System</h1>
          <p className="home-subtitle">Streamline academic performance tracking and analytics</p>
        </div>
        
        <div className="login-options">
          <div className="login-card" onClick={() => setLoginType("faculty")}>
            <div className="card-icon faculty-gradient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h3>Faculty Login</h3>
            <p>Access your dashboard to manage students and marks</p>
          </div>
          
          <div className="login-card" onClick={() => setLoginType("student")}>
            <div className="card-icon student-gradient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3>Student Login</h3>
            <p>View your academic performance and grades</p>
          </div>
          
          <div className="login-card register-card" onClick={() => setLoginType("facultyRegister")}>
            <div className="card-icon register-gradient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
            <h3>Faculty Register</h3>
            <p>Create a new faculty account to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
}
