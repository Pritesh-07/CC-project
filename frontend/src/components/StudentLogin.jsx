import api from "../utils/api";
import { useState } from "react";

export default function StudentLogin({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email, password, role: "student"
      });

      if (res.data.user.role !== "student") {
        setError("Access denied. Student credentials required.");
        return;
      }

      // Store user data and token
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token); // Store the JWT token
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  return (
    <div className="container">
      <button className="back-btn" onClick={onBack}>← Back to Home</button>
      
      <div className="login-header">
        <div className="login-icon student-icon"></div>
        <h2> </h2>

      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>Student Email</label>
        <input 
          type="email"
          placeholder="Enter your student email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <input 
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </div>
      
      <button className="login-btn" onClick={login} disabled={loading}>
        {loading ? "Signing In..." : "Sign In "}
      </button>
    </div>
  );
}
