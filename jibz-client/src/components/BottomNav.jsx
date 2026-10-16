import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  {
    path: '/',
    label: 'Map',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round" width={24} height={24}>
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
        <line x1="9" y1="3" x2="9" y2="18"/>
        <line x1="15" y1="6" x2="15" y2="21"/>
      </svg>
    ),
  },
  {
    path: '/reels',
    label: 'Reels',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round" width={24} height={24}>
        <rect x="2" y="2" width="20" height="20" rx="4"/>
        <circle cx="12" cy="12" r="3" fill={active ? '#fff' : 'none'} stroke={active ? 'none' : 'currentColor'} strokeWidth="1.8"/>
        <line x1="2" y1="7" x2="22" y2="7" stroke={active ? 'rgba(255,255,255,0.4)' : 'currentColor'} strokeWidth="1.5"/>
        <line x1="2" y1="17" x2="22" y2="17" stroke={active ? 'rgba(255,255,255,0.4)' : 'currentColor'} strokeWidth="1.5"/>
        <line x1="7" y1="2" x2="7" y2="22" stroke={active ? 'rgba(255,255,255,0.4)' : 'currentColor'} strokeWidth="1.5"/>
        <line x1="17" y1="2" x2="17" y2="22" stroke={active ? 'rgba(255,255,255,0.4)' : 'currentColor'} strokeWidth="1.5"/>
      </svg>
    ),
  },
  { path: '/post', label: '', icon: null }, // center post button
  {
    path: '/explore',
    label: 'Explore',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round" width={24} height={24}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8}/>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={active ? 'currentColor' : 'none'} stroke={active ? 'none' : 'currentColor'} strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round" width={24} height={24}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8}/>
        <circle cx="12" cy="7" r="4" fill={active ? 'currentColor' : 'none'} stroke={active ? 'none' : 'currentColor'} strokeWidth="1.8"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => {
        if (tab.path === '/post') {
          return (
            <button
              key="post"
              className="tab-post"
              onClick={() => navigate('/post')}
              aria-label="Post clip"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" width={20} height={20}>
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          );
        }

        const active = location.pathname === tab.path ||
          (tab.path !== '/' && location.pathname.startsWith(tab.path));

        return (
          <button
            key={tab.path}
            className={`tab-item${active ? ' active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="tab-icon">{tab.icon(active)}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
