import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Reels.css';

// All clips keyed by feature name — add more here as the app grows
const CLIPS_BY_FEATURE = {
  'Down Rail': [
    { id: 101, user: { name: 'Jake M.', handle: '@jakemountain', avatar: '🏂' }, mountain: 'Liberty Mountain', trick: 'Backside 180', sport: '🏂', difficulty: 'intermediate', likes: 247, comments: 14, saves: 38, bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', gear: { board: 'Never Summer Proto 156', boots: 'ThirtyTwo TM-3', bindings: 'Union Atlas' } },
    { id: 102, user: { name: 'park_patrol', handle: '@park_patrol', avatar: '😤' }, mountain: 'Liberty Mountain', trick: 'Switch Backside 270', sport: '🏂', difficulty: 'expert', likes: 301, comments: 21, saves: 55, bg: 'linear-gradient(160deg, #1c0a2e 0%, #2d0a4e 50%, #1a0a3e 100%)', gear: { board: 'Burton Custom 158', boots: 'Burton Photon BOA', bindings: 'Burton Genesis' } },
    { id: 103, user: { name: 'Maya K.', handle: '@mayakills', avatar: '🏂' }, mountain: 'Liberty Mountain', trick: 'Frontside Boardslide', sport: '🏂', difficulty: 'beginner', likes: 189, comments: 9, saves: 22, bg: 'linear-gradient(160deg, #0d1b2a 0%, #1b2838 50%, #2a3a4a 100%)', gear: { board: 'Lib Tech Skate Banana 154', boots: 'DC Judge', bindings: 'Flow Nexus' } },
  ],
  'Rainbow Box': [
    { id: 201, user: { name: 'Sierra R.', handle: '@sierrarips', avatar: '⛷️' }, mountain: 'Liberty Mountain', trick: 'Ski Jib', sport: '⛷️', difficulty: 'beginner', likes: 134, comments: 8, saves: 19, bg: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #122b47 100%)', gear: { skis: 'K2 Poacher 172', boots: 'Atomic Hawx Ultra 110' } },
    { id: 202, user: { name: 'Jake M.', handle: '@jakemountain', avatar: '🏂' }, mountain: 'Liberty Mountain', trick: 'Noseslide', sport: '🏂', difficulty: 'intermediate', likes: 211, comments: 11, saves: 31, bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', gear: { board: 'Never Summer Proto 156', boots: 'ThirtyTwo TM-3', bindings: 'Union Atlas' } },
  ],
  'Liberty Pipe': [
    { id: 301, user: { name: 'Ty B.', handle: '@tybanzai', avatar: '🏂' }, mountain: 'Liberty Mountain', trick: 'Cab 900', sport: '🏂', difficulty: 'expert', likes: 3201, comments: 89, saves: 412, bg: 'linear-gradient(160deg, #1c0a2e 0%, #2d0a4e 50%, #1a0a3e 100%)', gear: { board: 'Burton Custom Flying V 158', boots: 'Burton Photon BOA', bindings: 'Burton Genesis' } },
    { id: 302, user: { name: 'Lex P.', handle: '@lexpow', avatar: '⛷️' }, mountain: 'Liberty Mountain', trick: 'Switch Cork 7', sport: '⛷️', difficulty: 'expert', likes: 2109, comments: 61, saves: 290, bg: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #122b47 100%)', gear: { skis: 'Armada ARW 96', boots: 'Lange RX 120 LV' } },
    { id: 303, user: { name: 'Sierra R.', handle: '@sierrarips', avatar: '⛷️' }, mountain: 'Liberty Mountain', trick: 'Front 7 Japan', sport: '⛷️', difficulty: 'intermediate', likes: 934, comments: 22, saves: 87, bg: 'linear-gradient(160deg, #0d1b2a 0%, #1b2838 50%, #2a3a4a 100%)', gear: { skis: 'K2 Poacher 172', boots: 'Atomic Hawx Ultra 110' } },
  ],
  'Flat Bar': [
    { id: 401, user: { name: 'Jake M.', handle: '@jakemountain', avatar: '🏂' }, mountain: 'Liberty Mountain', trick: 'Back Lip to Fakie', sport: '🏂', difficulty: 'expert', likes: 1842, comments: 47, saves: 203, bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', gear: { board: 'Never Summer Proto 156', boots: 'ThirtyTwo TM-3', bindings: 'Union Atlas' } },
    { id: 402, user: { name: 'Maya K.', handle: '@mayakills', avatar: '🏂' }, mountain: 'Liberty Mountain', trick: 'Frontside 50-50', sport: '🏂', difficulty: 'beginner', likes: 312, comments: 18, saves: 44, bg: 'linear-gradient(160deg, #1c0a2e 0%, #2d0a4e 50%, #1a0a3e 100%)', gear: { board: 'Lib Tech Skate Banana 154', boots: 'DC Judge', bindings: 'Flow Nexus' } },
  ],
  'Big Kicker': [
    { id: 501, user: { name: 'liberty_mike', handle: '@liberty_mike', avatar: '🎿' }, mountain: 'Liberty Mountain', trick: 'Cork 720', sport: '⛷️', difficulty: 'expert', likes: 512, comments: 29, saves: 77, bg: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #122b47 100%)', gear: { skis: 'Line Pandora 94', boots: 'Salomon QST Pro 110' } },
    { id: 502, user: { name: 'liberty_carve', handle: '@liberty_carve', avatar: '🤘' }, mountain: 'Liberty Mountain', trick: 'FS 360 Nose Grab', sport: '🏂', difficulty: 'intermediate', likes: 189, comments: 10, saves: 27, bg: 'linear-gradient(160deg, #1c0a2e 0%, #2d0a4e 50%, #1a0a3e 100%)', gear: { board: 'Capita DOA 156', boots: 'Vans Aura Pro', bindings: 'Rome 390 Boss' } },
    { id: 503, user: { name: 'Ty B.', handle: '@tybanzai', avatar: '🏂' }, mountain: 'Liberty Mountain', trick: 'Cab 900', sport: '🏂', difficulty: 'expert', likes: 3201, comments: 89, saves: 412, bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', gear: { board: 'Burton Custom Flying V 158', boots: 'Burton Photon BOA', bindings: 'Burton Genesis' } },
  ],
};

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function GearPanel({ gear, onClose }) {
  return (
    <div className="gear-panel" onClick={onClose}>
      <div className="gear-panel-inner" onClick={e => e.stopPropagation()}>
        <div className="gear-handle" />
        <h3 className="gear-title">Gear Setup</h3>
        <div className="gear-list">
          {Object.entries(gear).map(([key, val]) => (
            <div key={key} className="gear-item">
              <span className="gear-key">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span className="gear-val">{val}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ marginTop: 8 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function FeatureReelCard({ clip, onUserTap }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(clip.likes);
  const [showGear, setShowGear] = useState(false);

  const toggleLike = () => {
    setLikeCount(c => liked ? c - 1 : c + 1);
    setLiked(!liked);
  };

  return (
    <div className="reel-card" style={{ background: clip.bg }}>
      <div className="reel-visual">
        <div className="reel-sport-emoji">{clip.sport}</div>
        <div className="reel-mountain-label">{clip.mountain}</div>
        <div className="reel-feature-label">{clip.trick}</div>
        <div className={`diff-badge ${clip.difficulty}`} style={{ position: 'absolute', top: 16, right: 16 }}>
          {clip.difficulty}
        </div>
      </div>
      <div className="reel-overlay" />

      <div className="reel-info">
        <div className="reel-user-row">
          <button
            onClick={() => onUserTap(clip.user)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 1 }}
          >
            <div className="avatar" style={{ width: 38, height: 38, fontSize: '1.2em' }}>{clip.user.avatar}</div>
            <div>
              <div className="reel-username">{clip.user.name}</div>
              <div className="reel-handle">{clip.user.handle}</div>
            </div>
          </button>
          <button className="btn-follow">Follow</button>
        </div>
      </div>

      <div className="reel-actions">
        <button className={`reel-action-btn${liked ? ' liked' : ''}`} onClick={toggleLike}>
          <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={liked ? 0 : 2} width={26} height={26}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span className="reel-action-count">{formatCount(likeCount)}</span>
        </button>

        <button className="reel-action-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={26} height={26}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="reel-action-count">{formatCount(clip.comments)}</span>
        </button>

        <button className={`reel-action-btn${saved ? ' saved' : ''}`} onClick={() => setSaved(p => !p)}>
          <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={saved ? 0 : 2} width={26} height={26}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="reel-action-count">{formatCount(clip.saves)}</span>
        </button>

        <button className="reel-action-btn gear-btn" onClick={() => setShowGear(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={26} height={26}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span className="reel-action-count">Gear</span>
        </button>
      </div>

      {showGear && <GearPanel gear={clip.gear} onClose={() => setShowGear(false)} />}
    </div>
  );
}

export default function FeatureClips() {
  const { featureName } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const name = decodeURIComponent(featureName);
  const clips = CLIPS_BY_FEATURE[name] || [];

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    setCurrent(Math.round(el.scrollTop / el.clientHeight));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const goToUser = (user) => {
    navigate(`/user/${encodeURIComponent(user.handle)}`);
  };

  return (
    <>
      {/* Back button floats over the feed */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'fixed',
          top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
          left: 16,
          zIndex: 200,
          background: 'rgba(10,10,12,0.7)',
          backdropFilter: 'blur(12px)',
          border: '0.5px solid rgba(255,255,255,0.15)',
          borderRadius: 20,
          padding: '8px 14px 8px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          color: '#fff',
          fontFamily: 'var(--font)',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <svg viewBox="0 0 10 18" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={10} height={18}>
          <polyline points="9 1 1 9 9 17"/>
        </svg>
        {name}
      </button>

<div className="reels-container" ref={containerRef}>
        {clips.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ fontSize: 48 }}>🎬</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No clips yet</div>
            <div style={{ fontSize: 13 }}>Be the first to post on {name}</div>
          </div>
        ) : (
          clips.map((clip, i) => (
            <FeatureReelCard key={clip.id} clip={clip} active={i === current} onUserTap={goToUser} />
          ))
        )}
      </div>
    </>
  );
}
