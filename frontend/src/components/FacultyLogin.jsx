import axios from "axios";
import { useState } from "react";

export default function FacultyLogin({ onBack }) {
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
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email, password, role: "faculty"
      });

      if (res.data.user.role !== "faculty") {
        setError("Access denied. Faculty credentials required.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
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
        <div className="login-icon faculty-icon"></div>
        <h1> </h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>Faculty Email</label>
        <input 
          type="email"
          placeholder="Enter your faculty email"
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
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </div>
  );
}
