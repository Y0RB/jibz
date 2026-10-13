import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function ComingSoon({ page }) {
  return <div style={{ color: "#fff", padding: 40 }}>{page} — coming soon</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><ComingSoon page="Home" /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><ComingSoon page="Feed" /></ProtectedRoute>} />
        <Route path="/post" element={<ProtectedRoute><ComingSoon page="Post" /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><ComingSoon page="Explore" /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ComingSoon page="Profile" /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><ComingSoon page="Profile" /></ProtectedRoute>} />
        <Route path="/mountain/:id" element={<ProtectedRoute><ComingSoon page="Mountain" /></ProtectedRoute>} />
        <Route path="/feature/:id" element={<ProtectedRoute><ComingSoon page="Feature" /></ProtectedRoute>} />
        <Route path="/clip/:id" element={<ProtectedRoute><ComingSoon page="Clip" /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><ComingSoon page="Leaderboard" /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><ComingSoon page="Settings" /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><ComingSoon page="Notifications" /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
