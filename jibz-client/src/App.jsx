import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function ComingSoon({ label }) {
  return (
    <div style={{ color: "#fff", padding: "40px 24px", textAlign: "center", background: "#0d1117", minHeight: "100dvh" }}>
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>⛰️</div>
      <div style={{ fontSize: "20px", fontWeight: 500 }}>{label}</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginTop: "8px" }}>Coming in the next step</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><ComingSoon label="Home — Map" /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><ComingSoon label="Feed" /></ProtectedRoute>} />
        <Route path="/post" element={<ProtectedRoute><ComingSoon label="Post a clip" /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><ComingSoon label="Explore" /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ComingSoon label="Profile" /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><ComingSoon label="User profile" /></ProtectedRoute>} />
        <Route path="/mountain/:id" element={<ProtectedRoute><ComingSoon label="Mountain page" /></ProtectedRoute>} />
        <Route path="/feature/:id" element={<ProtectedRoute><ComingSoon label="Feature page" /></ProtectedRoute>} />
        <Route path="/clip/:id" element={<ProtectedRoute><ComingSoon label="Clip detail" /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><ComingSoon label="Leaderboard" /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><ComingSoon label="Settings" /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><ComingSoon label="Notifications" /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}