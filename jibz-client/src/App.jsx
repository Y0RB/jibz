import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Reels from './pages/Reels';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Post from './pages/Post';
import FeatureClips from './pages/FeatureClips';
import MountainClips from './pages/MountainClips';
import UserProfile from './pages/UserProfile';
import UserClips from './pages/UserClips';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import './styles/app.css';

function AppShell() {
  const location = useLocation();
  // Full-screen pages — no app-shell wrapper
  const isReels = location.pathname === '/reels';
  const isFeatureClips = location.pathname.startsWith('/feature/');
  const isMountainClips = location.pathname.startsWith('/mountain/');
  const isUserClips = location.pathname.endsWith('/clips');
  const isAuth = location.pathname === '/login' || location.pathname === '/register';

  if (isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  if (isReels || isFeatureClips || isMountainClips || isUserClips) {
    return (
      <>
        <Routes>
          <Route path="/reels" element={<Reels />} />
          <Route path="/feature/:featureName" element={<FeatureClips />} />
          <Route path="/mountain/:mountainName" element={<MountainClips />} />
          <Route path="/user/:handle/clips" element={<UserClips />} />
        </Routes>
        <BottomNav />
      </>
    );
  }

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post" element={<Post />} />
        <Route path="/user/:handle" element={<UserProfile />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
