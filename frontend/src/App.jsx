import Home from "./pages/Home";
import StudentDashboard from "./components/StudentDashboard";
import FacultyDashboard from "./components/FacultyDashboard";
import "./App.css";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Home />;
  if (user.role === "student") return <StudentDashboard user={user} />;
  return <FacultyDashboard user={user} />;
}

export default App;
