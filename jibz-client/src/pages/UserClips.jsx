import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import './Reels.css';

// Same user clip data as UserProfile — keyed by handle
const USER_CLIPS = {
  '@jakemountain': [
    { id: 1, user: { name: 'Jake M.', handle: '@jakemountain', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Down Rail', trick: 'Backside 180', caption: 'Back 180 on the down rail, first try of the day 🤙', sport: '🏂', difficulty: 'intermediate', likes: 247, comments: 14, saves: 38, bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', gear: { board: 'Never Summer Proto Synthesis 156', boots: 'ThirtyTwo TM-3 Lace', bindings: 'Union Atlas' } },
    { id: 2, user: { name: 'Jake M.', handle: '@jakemountain', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Flat Bar', trick: 'Back Lip to Fakie', caption: 'Finally stuck the back lip to fakie 🔥 20 tries but worth it', sport: '🏂', difficulty: 'expert', likes: 1842, comments: 47, saves: 203, bg: 'linear-gradient(160deg, #1c0a2e 0%, #2d0a4e 50%, #1a0a3e 100%)', gear: { board: 'Never Summer Proto Synthesis 156', boots: 'ThirtyTwo TM-3 Lace', bindings: 'Union Atlas' } },
    { id: 3, user: { name: 'Jake M.', handle: '@jakemountain', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Rainbow Box', trick: 'Noseslide', caption: 'Nose slide all the way down the rainbow 🌈', sport: '🏂', difficulty: 'intermediate', likes: 211, comments: 11, saves: 31, bg: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #122b47 100%)', gear: { board: 'Never Summer Proto Synthesis 156', boots: 'ThirtyTwo TM-3 Lace', bindings: 'Union Atlas' } },
    { id: 4, user: { name: 'Jake M.', handle: '@jakemountain', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Big Kicker', trick: 'Cab 540', caption: 'Caballerial 5 off the big kicker, clean landing 🙌', sport: '🏂', difficulty: 'intermediate', likes: 189, comments: 9, saves: 22, bg: 'linear-gradient(160deg, #0d1b2a 0%, #1b2838 50%, #2a3a4a 100%)', gear: { board: 'Never Summer Proto Synthesis 156', boots: 'ThirtyTwo TM-3 Lace', bindings: 'Union Atlas' } },
  ],
  '@sierrarips': [
    { id: 5, user: { name: 'Sierra R.', handle: '@sierrarips', avatar: '⛷️' }, mountain: 'Roundtop Mountain', feature: 'Halfpipe', trick: 'Front 7', caption: 'Front 7 to japan grab on a 2ft pipe lmaooo not bad for PA', sport: '⛷️', difficulty: 'intermediate', likes: 934, comments: 22, saves: 87, bg: 'linear-gradient(160deg, #0d1b2a 0%, #1b2838 50%, #2a3a4a 100%)', gear: { skis: 'K2 Poacher 172', boots: 'Atomic Hawx Ultra 110', poles: 'Leki Sherpa Lite' } },
    { id: 6, user: { name: 'Sierra R.', handle: '@sierrarips', avatar: '⛷️' }, mountain: 'Liberty Mountain', feature: 'Liberty Pipe', trick: 'Front 7 Japan', caption: 'Liberty pipe sending it 🤙', sport: '⛷️', difficulty: 'intermediate', likes: 512, comments: 14, saves: 62, bg: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #122b47 100%)', gear: { skis: 'K2 Poacher 172', boots: 'Atomic Hawx Ultra 110', poles: 'Leki Sherpa Lite' } },
    { id: 7, user: { name: 'Sierra R.', handle: '@sierrarips', avatar: '⛷️' }, mountain: 'Liberty Mountain', feature: 'Rainbow Box', trick: 'Ski Jib', caption: 'Jibbing the rainbow, park skiing is underrated ⛷️', sport: '⛷️', difficulty: 'beginner', likes: 134, comments: 8, saves: 19, bg: 'linear-gradient(160deg, #101828 0%, #1a2a38 50%, #0e2030 100%)', gear: { skis: 'K2 Poacher 172', boots: 'Atomic Hawx Ultra 110', poles: 'Leki Sherpa Lite' } },
  ],
  '@tybanzai': [
    { id: 8,  user: { name: 'Ty B.', handle: '@tybanzai', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Big Kicker', trick: 'Cab 900', caption: 'Cab 9 in park conditions is wild, snowpack was perfect today', sport: '🏂', difficulty: 'expert', likes: 3201, comments: 89, saves: 412, bg: 'linear-gradient(160deg, #1c0a2e 0%, #2d0a4e 50%, #1a0a3e 100%)', gear: { board: 'Burton Custom Flying V 158', boots: 'Burton Photon BOA', bindings: 'Burton Genesis' } },
    { id: 9,  user: { name: 'Ty B.', handle: '@tybanzai', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Liberty Pipe', trick: 'Switch Cab 720', caption: 'Switch cab 7 in the pipe 😤 PA riding is real', sport: '🏂', difficulty: 'expert', likes: 2800, comments: 71, saves: 310, bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', gear: { board: 'Burton Custom Flying V 158', boots: 'Burton Photon BOA', bindings: 'Burton Genesis' } },
    { id: 10, user: { name: 'Ty B.', handle: '@tybanzai', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Down Rail', trick: 'Frontside Bluntslide', caption: 'Blunt slide all the way down the down rail 🛹', sport: '🏂', difficulty: 'expert', likes: 1100, comments: 33, saves: 145, bg: 'linear-gradient(160deg, #0d1b2a 0%, #1b2838 50%, #2a3a4a 100%)', gear: { board: 'Burton Custom Flying V 158', boots: 'Burton Photon BOA', bindings: 'Burton Genesis' } },
    { id: 11, user: { name: 'Ty B.', handle: '@tybanzai', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Flat Bar', trick: 'Hardway Backside 270', caption: 'Hardway back 2-7-0 out, hardest trick I\'ve done on a flat bar', sport: '🏂', difficulty: 'expert', likes: 890, comments: 28, saves: 99, bg: 'linear-gradient(160deg, #1c0a2e 0%, #2d0a4e 50%, #1a0a3e 100%)', gear: { board: 'Burton Custom Flying V 158', boots: 'Burton Photon BOA', bindings: 'Burton Genesis' } },
    { id: 12, user: { name: 'Ty B.', handle: '@tybanzai', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Big Kicker', trick: 'Backside 1080', caption: 'BS 10 attempt — almost had it 💀', sport: '🏂', difficulty: 'expert', likes: 650, comments: 41, saves: 88, bg: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #122b47 100%)', gear: { board: 'Burton Custom Flying V 158', boots: 'Burton Photon BOA', bindings: 'Burton Genesis' } },
    { id: 13, user: { name: 'Ty B.', handle: '@tybanzai', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Liberty Pipe', trick: 'Double Cork 10', caption: 'Double cork 10 attempt in the pipe, close 🙏', sport: '🏂', difficulty: 'expert', likes: 420, comments: 19, saves: 55, bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', gear: { board: 'Burton Custom Flying V 158', boots: 'Burton Photon BOA', bindings: 'Burton Genesis' } },
  ],
  '@lexpow': [
    { id: 14, user: { name: 'Lex P.', handle: '@lexpow', avatar: '⛷️' }, mountain: 'Roundtop Mountain', feature: 'Big Air Kicker', trick: 'Switch Cork 7', caption: 'Switch cork 7 into the flats, still alive 🙏', sport: '⛷️', difficulty: 'expert', likes: 2109, comments: 61, saves: 290, bg: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #122b47 100%)', gear: { skis: 'Armada ARW 96 170', boots: 'Lange RX 120 LV', poles: 'Black Crows Oxus' } },
    { id: 15, user: { name: 'Lex P.', handle: '@lexpow', avatar: '⛷️' }, mountain: 'Liberty Mountain', feature: 'Liberty Pipe', trick: 'Switch Cork 7', caption: 'Liberty pipe version of the switch cork 7 🎿', sport: '⛷️', difficulty: 'expert', likes: 1800, comments: 44, saves: 210, bg: 'linear-gradient(160deg, #0d1b2a 0%, #1b2838 50%, #2a3a4a 100%)', gear: { skis: 'Armada ARW 96 170', boots: 'Lange RX 120 LV', poles: 'Black Crows Oxus' } },
    { id: 16, user: { name: 'Lex P.', handle: '@lexpow', avatar: '⛷️' }, mountain: 'Liberty Mountain', feature: 'Rainbow Box', trick: 'Ski Jib Swap', caption: 'Jib swap on the rainbow, ski jibs are slept on', sport: '⛷️', difficulty: 'intermediate', likes: 300, comments: 12, saves: 38, bg: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #122b47 100%)', gear: { skis: 'Armada ARW 96 170', boots: 'Lange RX 120 LV', poles: 'Black Crows Oxus' } },
  ],
  '@liberty_mike': [
    { id: 17, user: { name: 'Mike K.', handle: '@liberty_mike', avatar: '🎿' }, mountain: 'Liberty Mountain', feature: 'Big Kicker', trick: 'Cork 720', caption: 'Cork 7 off the big kicker, this lip was everything 🔥', sport: '⛷️', difficulty: 'expert', likes: 512, comments: 29, saves: 77, bg: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #122b47 100%)', gear: { skis: 'Line Pandora 94', boots: 'Salomon QST Pro 110', poles: 'Faction Candide 2.0' } },
    { id: 18, user: { name: 'Mike K.', handle: '@liberty_mike', avatar: '🎿' }, mountain: 'Liberty Mountain', feature: 'Flat Bar', trick: 'Ski Press', caption: 'Pressing the flat bar all day, good session at Liberty', sport: '⛷️', difficulty: 'intermediate', likes: 198, comments: 9, saves: 24, bg: 'linear-gradient(160deg, #101828 0%, #1a2a38 50%, #0e2030 100%)', gear: { skis: 'Line Pandora 94', boots: 'Salomon QST Pro 110', poles: 'Faction Candide 2.0' } },
  ],
  '@mayakills': [
    { id: 19, user: { name: 'Maya K.', handle: '@mayakills', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Flat Bar', trick: 'Frontside 50-50', caption: 'FS 50-50 on the flat bar, getting more comfortable up here 🏂', sport: '🏂', difficulty: 'beginner', likes: 312, comments: 18, saves: 44, bg: 'linear-gradient(160deg, #1c0a2e 0%, #2d0a4e 50%, #1a0a3e 100%)', gear: { board: 'Capita DOA 150', boots: 'Vans Infuse', bindings: 'Union Contact Pro' } },
    { id: 20, user: { name: 'Maya K.', handle: '@mayakills', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Rainbow Box', trick: 'Boardslide', caption: 'Boardslide on the rainbow, jibbing everything in sight 🏂', sport: '🏂', difficulty: 'beginner', likes: 189, comments: 7, saves: 21, bg: 'linear-gradient(160deg, #0d1b2a 0%, #1b2838 50%, #2a3a4a 100%)', gear: { board: 'Capita DOA 150', boots: 'Vans Infuse', bindings: 'Union Contact Pro' } },
    { id: 21, user: { name: 'Maya K.', handle: '@mayakills', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Down Rail', trick: 'Frontside Bluntslide', caption: 'Blunt slide on the down rail 😤 progression is real', sport: '🏂', difficulty: 'expert', likes: 445, comments: 22, saves: 58, bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', gear: { board: 'Capita DOA 150', boots: 'Vans Infuse', bindings: 'Union Contact Pro' } },
    { id: 22, user: { name: 'Maya K.', handle: '@mayakills', avatar: '🏂' }, mountain: 'Liberty Mountain', feature: 'Big Kicker', trick: 'Backside 360', caption: 'Back 3 off the big kicker, first kicker clip ever 🙌', sport: '🏂', difficulty: 'intermediate', likes: 231, comments: 11, saves: 30, bg: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #122b47 100%)', gear: { board: 'Capita DOA 150', boots: 'Vans Infuse', bindings: 'Union Contact Pro' } },
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

function UserReelCard({ clip }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(clip.likes);
  const [panel, setPanel] = useState(null);

  const toggleLike = () => {
    setLiked(p => { setLikeCount(c => p ? c - 1 : c + 1); return !p; });
  };

  return (
    <div className="reel-card" style={{ background: clip.bg }}>
      <div className="reel-visual">
        <div className="reel-sport-emoji">{clip.sport}</div>
        <div className="reel-mountain-label">{clip.mountain}</div>
        <div className="reel-feature-label">{clip.feature}</div>
        <div className={`diff-badge ${clip.difficulty}`} style={{ position: 'absolute', top: 16, right: 16 }}>
          {clip.difficulty}
        </div>
      </div>

      <div className="reel-overlay" />

      <div className="reel-info">
        <div className="reel-user-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div className="avatar" style={{ width: 38, height: 38, fontSize: '1.2em' }}>{clip.user.avatar}</div>
            <div style={{ textAlign: 'left' }}>
              <div className="reel-username">{clip.user.name}</div>
              <div className="reel-handle">{clip.user.handle}</div>
            </div>
          </div>
        </div>
        <p className="reel-caption">{clip.trick} · {clip.caption}</p>
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

        <button className="reel-action-btn" onClick={() => setPanel('gear')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={26} height={26}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span className="reel-action-count">Gear</span>
        </button>
      </div>

      {panel === 'gear' && <GearPanel gear={clip.gear} onClose={() => setPanel(null)} />}
    </div>
  );
}

export default function UserClips() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const decodedHandle = decodeURIComponent(handle);
  const clips = USER_CLIPS[decodedHandle] || [];
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    setCurrent(idx);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Get the user's name for the back button
  const userName = clips[0]?.user.name || decodedHandle;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Back button */}
      <div style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        left: 16,
        zIndex: 50,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(10,10,12,0.7)',
            backdropFilter: 'blur(12px)',
            border: '0.5px solid rgba(255,255,255,0.15)',
            borderRadius: 20,
            padding: '7px 14px',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font)',
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 10 18" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={10} height={10}>
            <polyline points="9 1 1 9 9 17"/>
          </svg>
          {userName}
        </button>
      </div>

      <div className="reels-container" ref={containerRef}>
        {clips.length > 0 ? clips.map(clip => (
          <UserReelCard key={clip.id} clip={clip} />
        )) : (
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--fg-3)', gap: 12,
          }}>
            <div style={{ fontSize: 48 }}>🎬</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No clips yet</div>
          </div>
        )}
      </div>
    </div>
  );
}
