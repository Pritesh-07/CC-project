import { useState } from "react";
import FacultyLogin from "../components/FacultyLogin";
import StudentLogin from "../components/StudentLogin";

export default function Home() {
  const [loginType, setLoginType] = useState("");

  if (loginType === "faculty") {
    return <FacultyLogin onBack={() => setLoginType("")} />;
  }
  
  if (loginType === "student") {
    return <StudentLogin onBack={() => setLoginType("")} />;
  }

  return (
    <div className="home-container">
      <div className="login-options">
        <button className="login-btn" onClick={() => setLoginType("faculty")}>
          Faculty Login
        </button>
        <button className="login-btn" onClick={() => setLoginType("student")}>
          Student Login
        </button>
      </div>
    </div>
  );
}
