import api from "../utils/api";
import { useState } from "react";

export default function FacultyRegister({ onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      setError("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: "faculty",
        department: formData.department.trim()
      });

      setSuccess("Faculty registered successfully! You can now login.");
      setFormData({ name: "", email: "", password: "", department: "" });
      
      // Store user data and token if auto-login is desired
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
      }
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="container">
      <button className="back-btn" onClick={onBack}>← Back to Home</button>
      
      <div className="login-header">
        <div className="login-icon faculty-icon"></div>
        <h2>Faculty Registration</h2>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="form-group">
        <label>Full Name</label>
        <input 
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label>Email Address</label>
        <input 
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <input 
          type="password"
          placeholder="Create a password (min 6 characters)"
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label>Department</label>
        <input 
          type="text"
          placeholder="Enter your department (e.g., Computer Science)"
          value={formData.department}
          onChange={e => setFormData({...formData, department: e.target.value})}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </div>
      
      <button className="login-btn" onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}
