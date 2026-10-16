import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reels.css';

const REELS = [
  {
    id: 1,
    user: { name: 'Jake M.', handle: '@jakemountain', avatar: '🏂' },
    mountain: 'Liberty Mountain',
    feature: 'Central Park Rail',
    caption: 'Back lip to fakie on the flat bar 🔥 finally stuck it after 20 tries',
    sport: '🏂',
    difficulty: 'expert',
    likes: 1842,
    comments: 47,
    saves: 203,
    bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    gear: {
      board: 'Never Summer Proto Synthesis 156',
      boots: 'ThirtyTwo TM-3 Lace',
      bindings: 'Union Atlas',
      outerwear: 'Volcom L Gore-Tex Jacket',
    },
  },
  {
    id: 2,
    user: { name: 'Sierra R.', handle: '@sierrarips', avatar: '⛷️' },
    mountain: 'Roundtop Mountain',
    feature: 'Halfpipe',
    caption: 'Front 7 to japan grab on a 2ft pipe lmaooo not bad for PA',
    sport: '⛷️',
    difficulty: 'intermediate',
    likes: 934,
    comments: 22,
    saves: 87,
    bg: 'linear-gradient(160deg, #0d1b2a 0%, #1b2838 50%, #2a3a4a 100%)',
    gear: {
      skis: "K2 Poacher 172",
      boots: 'Atomic Hawx Ultra 110',
      poles: 'Leki Sherpa Lite',
      helmet: 'Smith Vantage MIPS',
    },
  },
  {
    id: 3,
    user: { name: 'Ty B.', handle: '@tybanzai', avatar: '🏂' },
    mountain: 'Liberty Mountain',
    feature: 'Kicker Line',
    caption: 'Cab 900 in park conditions is wild, snowpack was perfect today',
    sport: '🏂',
    difficulty: 'expert',
    likes: 3201,
    comments: 89,
    saves: 412,
    bg: 'linear-gradient(160deg, #1c0a2e 0%, #2d0a4e 50%, #1a0a3e 100%)',
    gear: {
      board: 'Burton Custom Flying V 158',
      boots: "Burton Photon BOA",
      bindings: 'Burton Genesis',
      helmet: 'Sandbox Classic 2.0',
    },
  },
  {
    id: 4,
    user: { name: 'Lex P.', handle: '@lexpow', avatar: '⛷️' },
    mountain: 'Roundtop Mountain',
    feature: 'Big Air Kicker',
    caption: 'Switch cork 7 into the flats, still alive 🙏',
    sport: '⛷️',
    difficulty: 'expert',
    likes: 2109,
    comments: 61,
    saves: 290,
    bg: 'linear-gradient(160deg, #0a1628 0%, #0d2137 50%, #122b47 100%)',
    gear: {
      skis: 'Armada ARW 96 170',
      boots: 'Lange RX 120 LV',
      poles: 'Black Crows Oxus',
      outerwear: 'Saga Anomie Jacket',
    },
  },
];

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

function CommentPanel({ count, onClose }) {
  const [text, setText] = useState('');
  const comments = [
    { user: 'pow_patrol', text: 'Absolute send! 🤙', time: '2h' },
    { user: 'jibzfan99', text: 'PA snowboarding is so underrated', time: '3h' },
    { user: 'mountain.mike', text: 'What binding angles are you running?', time: '5h' },
  ];
  return (
    <div className="gear-panel" onClick={onClose}>
      <div className="gear-panel-inner" onClick={e => e.stopPropagation()}>
        <div className="gear-handle" />
        <h3 className="gear-title">Comments · {count}</h3>
        <div className="comment-list">
          {comments.map((c, i) => (
            <div key={i} className="comment-row">
              <div className="comment-avatar">👤</div>
              <div className="comment-body">
                <span className="comment-user">{c.user}</span>
                <span className="comment-text">{c.text}</span>
              </div>
              <span className="comment-time">{c.time}</span>
            </div>
          ))}
        </div>
        <div className="comment-input-row">
          <input
            className="comment-input"
            placeholder="Add a comment…"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button className="comment-send" disabled={!text.trim()} onClick={() => setText('')}>↑</button>
        </div>
      </div>
    </div>
  );
}

function ReelCard({ reel, active }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(reel.likes);
  const [panel, setPanel] = useState(null); // 'gear' | 'comments' | null

  const toggleLike = () => {
    setLiked(p => {
      setLikeCount(c => p ? c - 1 : c + 1);
      return !p;
    });
  };

  return (
    <div className="reel-card" style={{ background: reel.bg }}>
      {/* Simulated video — snowboarding graphic */}
      <div className="reel-visual">
        <div className="reel-sport-emoji">{reel.sport}</div>
        <div className="reel-mountain-label">{reel.mountain}</div>
        <div className="reel-feature-label">{reel.feature}</div>
        <div className={`diff-badge ${reel.difficulty}`} style={{ position: 'absolute', top: 16, right: 16 }}>
          {reel.difficulty}
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="reel-overlay" />

      {/* Bottom info */}
      <div className="reel-info">
        <div className="reel-user-row">
          <button
            onClick={() => navigate(`/user/${encodeURIComponent(reel.user.handle)}`)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 1 }}
          >
            <div className="avatar" style={{ width: 38, height: 38, fontSize: '1.2em' }}>{reel.user.avatar}</div>
            <div style={{ textAlign: 'left' }}>
              <div className="reel-username">{reel.user.name}</div>
              <div className="reel-handle">{reel.user.handle}</div>
            </div>
          </button>
          <button className="btn-follow" style={{ marginLeft: 'auto' }}>Follow</button>
        </div>
        <p className="reel-caption">{reel.caption}</p>
      </div>

      {/* Right actions */}
      <div className="reel-actions">
        <button className={`reel-action-btn${liked ? ' liked' : ''}`} onClick={toggleLike}>
          <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={liked ? 0 : 2} width={26} height={26}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span className="reel-action-count">{formatCount(likeCount)}</span>
        </button>

        <button className="reel-action-btn" onClick={() => setPanel('comments')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={26} height={26}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="reel-action-count">{formatCount(reel.comments)}</span>
        </button>

        <button className={`reel-action-btn${saved ? ' saved' : ''}`} onClick={() => setSaved(p => !p)}>
          <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={saved ? 0 : 2} width={26} height={26}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="reel-action-count">{formatCount(reel.saves)}</span>
        </button>

        <button className="reel-action-btn" onClick={() => {}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={26} height={26}>
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          <span className="reel-action-count">Share</span>
        </button>

        <button className="reel-action-btn gear-btn" onClick={() => setPanel('gear')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={26} height={26}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span className="reel-action-count">Gear</span>
        </button>
      </div>

      {panel === 'gear' && <GearPanel gear={reel.gear} onClose={() => setPanel(null)} />}
      {panel === 'comments' && <CommentPanel count={reel.comments} onClose={() => setPanel(null)} />}
    </div>
  );
}

export default function Reels() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const isScrolling = useRef(false);

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

  return (
    <div className="reels-container" ref={containerRef}>
      {REELS.map((reel, i) => (
        <ReelCard key={reel.id} reel={reel} active={i === current} />
      ))}
    </div>
  );
}
