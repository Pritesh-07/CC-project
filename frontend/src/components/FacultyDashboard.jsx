import { useState } from "react";
import AddMarks from "./AddMarks";
import RegisterStudent from "./RegisterStudent";
import ClassAnalytics from "./ClassAnalytics";

export default function FacultyDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("students");
  
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  const tabs = [
    { id: "students", label: "My Students", icon: "" },
    { id: "marks", label: "Add Marks", icon: "" },
    { id: "analytics", label: "Class Analytics", icon: "" }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h2>Welcome</h2>
          
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
      
      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="dashboard-content">
        {activeTab === "students" && <RegisterStudent user={user} />}
        {activeTab === "marks" && <AddMarks user={user} />}
        {activeTab === "analytics" && <ClassAnalytics user={user} />}
      </div>
    </div>
  );
}
