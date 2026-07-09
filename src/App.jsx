import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import SuperAdmin from "./SuperAdmin";
import Admin from "./Admin";
import User from "./User";
import ChatBot from "./ChatBot";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/superadmin-dashboard" element={<SuperAdmin />} />
        <Route path="/admin-dashboard" element={<Admin />} />
        <Route path="/user-dashboard" element={<User />} />
        <Route path="/chatBot" element={<ChatBot />} />
      </Routes>
    </Router>
  );
}

export default App;