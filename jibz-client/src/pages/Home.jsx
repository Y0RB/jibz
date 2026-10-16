import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ─── Mock data (replace with API calls) ───────────────────────────
const MOUNTAINS = {
  'Liberty Mountain': {
    name: 'Liberty Mountain',
    location: 'Carroll Valley, PA',
    openRuns: 18,
    totalRuns: 24,
    snowDepth: '34"',
    temp: '28°F',
    features: [
      { id: 1, name: 'Down Rail',    emoji: '🛹', run: 'Liberty Park',  diff: 'intermediate', rating: 4.7, clips: 23, x: 46, y: 52 },
      { id: 2, name: 'Rainbow Box',  emoji: '📦', run: 'Liberty Park',  diff: 'beginner',     rating: 4.5, clips: 15, x: 48, y: 40 },
      { id: 3, name: 'Liberty Pipe', emoji: '🏔️', run: 'Upper Ridge',   diff: 'expert',       rating: 4.9, clips: 62, x: 68, y: 32 },
      { id: 4, name: 'Flat Bar',     emoji: '⚡', run: 'Main Park',     diff: 'intermediate', rating: 4.6, clips: 31, x: 46, y: 64 },
      { id: 5, name: 'Big Kicker',   emoji: '🚀', run: 'Main Park',     diff: 'expert',       rating: 4.8, clips: 44, x: 66, y: 58 },
    ],
    topClips: [
      { id: 1, user: 'jake_rips',     avatar: '🤙', trick: 'Backside 180',        feature: 'Down Rail',  likes: 247, sport: '🏂' },
      { id: 2, user: 'liberty_mike',  avatar: '🎿', trick: 'Cork 720',            feature: 'Big Kicker', likes: 512, sport: '⛷️' },
      { id: 3, user: 'liberty_carve', avatar: '🤘', trick: 'FS 360 Nose Grab',    feature: 'Big Kicker', likes: 189, sport: '🏂' },
      { id: 4, user: 'park_patrol',   avatar: '😤', trick: 'Switch Backside 270', feature: 'Down Rail',  likes: 301, sport: '🏂' },
    ],
    rotm: { user: 'mike_krew', avatar: '👑', clip: 'Cab 900', feature: 'Big Kicker', likes: 1240, sport: '🏂' },
  },
  'Roundtop Mountain': {
    name: 'Roundtop Mountain',
    location: 'Lewisberry, PA',
    openRuns: 14,
    totalRuns: 20,
    snowDepth: '28"',
    temp: '31°F',
    features: [
      { id: 6,  name: 'Halfpipe',      emoji: '🏔️', run: 'Summit Park',   diff: 'expert',       rating: 4.8, clips: 38, x: 50, y: 35 },
      { id: 7,  name: 'Down Box',      emoji: '📦', run: 'Main Park',     diff: 'beginner',     rating: 4.3, clips: 19, x: 44, y: 55 },
      { id: 8,  name: 'Big Air Kicker',emoji: '🚀', run: 'Upper Park',    diff: 'expert',       rating: 4.7, clips: 51, x: 65, y: 45 },
      { id: 9,  name: 'Butter Box',    emoji: '⚡', run: 'Main Park',     diff: 'intermediate', rating: 4.5, clips: 27, x: 48, y: 68 },
      { id: 10, name: 'Wallride',      emoji: '🛹', run: 'Jib Zone',      diff: 'intermediate', rating: 4.4, clips: 22, x: 68, y: 62 },
    ],
    topClips: [
      { id: 5, user: 'sierrarips',  avatar: '⛷️', trick: 'Front 7',        feature: 'Halfpipe',       likes: 934,  sport: '⛷️' },
      { id: 6, user: 'lexpow',      avatar: '⛷️', trick: 'Switch Cork 7',  feature: 'Big Air Kicker', likes: 2109, sport: '⛷️' },
      { id: 7, user: 'mayakills',   avatar: '🏂', trick: 'Nose Press',     feature: 'Butter Box',     likes: 312,  sport: '🏂' },
      { id: 8, user: 'rt_ripper',   avatar: '🏂', trick: 'Cab 540',        feature: 'Big Air Kicker', likes: 187,  sport: '🏂' },
    ],
    rotm: { user: 'lexpow', avatar: '⛷️', clip: 'Switch Cork 7', feature: 'Big Air Kicker', likes: 2109, sport: '⛷️' },
  },
};

// ─── Pin component ─────────────────────────────────────────────────
function FeaturePin({ feature, onTap }) {
  return (
    <button
      onClick={() => onTap(feature)}
      style={{
        position: 'absolute',
        left: `${feature.x}%`,
        top: `${feature.y}%`,
        transform: 'translate(-50%, -50%)',
        background: 'rgba(10,10,12,0.82)',
        backdropFilter: 'blur(10px)',
        border: '0.5px solid rgba(255,255,255,0.18)',
        borderRadius: 10,
        padding: '5px 10px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        zIndex: 5,
        transition: 'transform 0.15s',
        fontFamily: 'var(--font)',
      }}
      onTouchStart={e => e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1.12)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1)'}
    >
      <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
        {feature.emoji} {feature.name}
      </span>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>
        ★{feature.rating} · {feature.clips} clips
      </span>
    </button>
  );
}

// ─── Feature sheet ─────────────────────────────────────────────────
function FeatureSheet({ feature, onClose, onView, mountainName }) {
  if (!feature) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 20, cursor: 'pointer',
        }}
      />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--bg-2)',
        borderRadius: '20px 20px 0 0',
        padding: '0 20px 32px',
        zIndex: 21,
        animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
      }}>
        {/* drag handle */}
        <div style={{ width: 36, height: 4, background: 'var(--border-2)', borderRadius: 2, margin: '12px auto 20px' }} />

        <div style={{
          height: 130,
          background: 'var(--bg-3)',
          borderRadius: 'var(--r-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 56,
          marginBottom: 16,
          position: 'relative',
        }}>
          {feature.emoji}
          <span className={`diff-badge ${feature.diff}`} style={{ position: 'absolute', top: 10, right: 10 }}>
            {feature.diff}
          </span>
        </div>

        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{feature.name}</div>
        <div style={{ color: 'var(--fg-3)', fontSize: 14, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {feature.run} · {mountainName}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
          <span style={{ color: '#ffd60a', fontSize: 16 }}>★★★★★</span>
          <span style={{ color: 'var(--fg-2)', fontSize: 14 }}>{feature.rating} · {feature.clips} clips</span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" style={{ fontSize: 15 }} onClick={() => onView(feature)}>
            View {feature.clips} clips
          </button>
          <button className="btn-ghost" onClick={onClose} style={{ flexShrink: 0 }}>✕</button>
        </div>
      </div>
    </>
  );
}

// ─── Clip thumbnail ────────────────────────────────────────────────
function ClipThumb({ clip, onUserTap, onCardTap }) {
  const [liked, setLiked] = useState(false);
  return (
    <div
      onClick={onCardTap}
      style={{
        flexShrink: 0,
        width: 140,
        background: 'var(--bg-3)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <div style={{
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 52,
        background: 'linear-gradient(160deg, var(--bg-3), #0a0a14)',
      }}>
        {clip.sport}
      </div>
      {/* play icon */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 38, height: 38,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(6px)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg viewBox="0 0 24 24" fill="white" width={14} height={14}><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '24px 10px 10px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{clip.trick}</div>
        <button
          onClick={(e) => { e.stopPropagation(); onUserTap && onUserTap(clip.user); }}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font)' }}
        >{clip.user}</button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>
            ♥ {liked ? clip.likes + 1 : clip.likes}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: liked ? '#ff453a' : 'rgba(255,255,255,0.5)',
              fontSize: 14, padding: 0,
              transition: 'transform 0.15s',
              transform: liked ? 'scale(1.2)' : 'scale(1)',
            }}
          >♥</button>
        </div>
      </div>
    </div>
  );
}

// ─── ROTM card ──────────────────────────────────────────────────────
function ROTMCard({ rotm, onTap }) {
  return (
    <div
      onClick={onTap}
      style={{
        margin: '0 20px',
        background: 'linear-gradient(135deg, #1a1400, #221c00)',
        border: '0.5px solid rgba(255,214,10,0.3)',
        borderRadius: 'var(--r-xl)',
        padding: 16,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* glow */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 120, height: 120,
        background: 'radial-gradient(circle, rgba(255,214,10,0.12), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,214,10,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        🏆 Rider of the Month
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 52, height: 52,
          background: 'rgba(255,214,10,0.12)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, border: '1.5px solid rgba(255,214,10,0.3)',
        }}>{rotm.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 1 }}>{rotm.user}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Best clip: {rotm.clip} · {rotm.feature}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,214,10,0.6)', marginTop: 3 }}>♥ {rotm.likes.toLocaleString()} likes this month</div>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,214,10,0.5)" strokeWidth={2} strokeLinecap="round" width={18} height={18}>
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Mountain picker sheet ──────────────────────────────────────────
function MountainPicker({ current, onSelect, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
      />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--bg-2)',
        borderRadius: '20px 20px 0 0',
        padding: '0 20px calc(env(safe-area-inset-bottom,0px) + 32px)',
        zIndex: 41,
        animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
      }}>
        <div style={{ width: 36, height: 4, background: 'var(--border-2)', borderRadius: 2, margin: '12px auto 20px' }} />
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Switch Mountain</div>
        {Object.values(MOUNTAINS).map(m => (
          <button
            key={m.name}
            onClick={() => { onSelect(m.name); onClose(); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '14px 16px',
              background: current === m.name ? 'var(--bg-3)' : 'transparent',
              border: current === m.name ? '0.5px solid var(--accent)' : '0.5px solid transparent',
              borderRadius: 14, marginBottom: 10,
              cursor: 'pointer', fontFamily: 'var(--font)',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: current === m.name ? 'var(--accent)' : 'var(--fg)' }}>{m.name}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{m.location} · {m.openRuns}/{m.totalRuns} runs open</div>
            </div>
            {current === m.name && (
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" width={18} height={18}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </>
  );
}

// ─── Main page ──────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMountainName, setActiveMountainName] = useState(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get('mountain');
    return (m && MOUNTAINS[m]) ? m : 'Liberty Mountain';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get('mountain');
    if (m && MOUNTAINS[m]) setActiveMountainName(m);
  }, [location.search]);
  const [showPicker, setShowPicker] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [sportFilter, setSportFilter] = useState('all');

  const MOUNTAIN = MOUNTAINS[activeMountainName];
  const FEATURES = MOUNTAIN.features;
  const TOP_CLIPS = MOUNTAIN.topClips;
  const ROTM = MOUNTAIN.rotm;

  const filteredClips = sportFilter === 'all' ? TOP_CLIPS
    : TOP_CLIPS.filter(c => sportFilter === 'ski' ? c.sport === '⛷️' : c.sport === '🏂');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Map ──────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: '45vh', minHeight: 280, flexShrink: 0, overflow: 'hidden' }}>

        {/* Mountain SVG map */}
        <svg viewBox="0 0 390 340" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
          <rect width="390" height="340" fill="#080e08"/>
          {/* Sky gradient */}
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a1020"/>
              <stop offset="100%" stopColor="#0d1a0d"/>
            </linearGradient>
            <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c8d8e8" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#a0b8cc" stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          <rect width="390" height="340" fill="url(#skyGrad)"/>
          {/* Stars */}
          {[[30,20],[80,15],[140,25],[200,10],[260,18],[320,12],[370,22],[50,40],[170,35],[310,30]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r={0.8} fill="rgba(255,255,255,0.6)"/>
          ))}
          {/* Far mountain */}
          <path d="M0,220 L60,100 L120,160 L180,60 L240,120 L300,80 L360,130 L390,100 L390,340 L0,340Z" fill="#111a10" opacity="0.9"/>
          {/* Near mountain */}
          <path d="M0,260 L70,150 L140,200 L200,90 L260,160 L330,120 L390,160 L390,340 L0,340Z" fill="#0e160c"/>
          {/* Snow caps */}
          <path d="M200,90 L185,130 L215,125Z" fill="url(#snowGrad)"/>
          <path d="M300,80 L288,108 L312,105Z" fill="url(#snowGrad)" opacity="0.7"/>
          {/* Ski runs */}
          <path d="M200,90 L175,180 L155,280" stroke="rgba(255,255,255,0.12)" strokeWidth="16" fill="none" strokeLinecap="round"/>
          <path d="M200,90 L220,170 L240,270" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M200,90 L195,160 L205,240 L190,300" stroke="rgba(255,255,255,0.08)" strokeWidth="9" fill="none" strokeLinecap="round"/>
          {/* Run labels */}
          <text x="125" y="168" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="-apple-system,sans-serif" transform="rotate(-18,125,168)">Liberty Park</text>
          <text x="232" y="175" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="-apple-system,sans-serif" transform="rotate(10,232,175)">Upper Ridge</text>
          <text x="170" y="230" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="-apple-system,sans-serif" transform="rotate(-5,170,230)">Main Park</text>
          {/* Tree clusters */}
          {[[35,230,18],[360,210,14],[330,250,18],[55,265,16],[290,190,14],[380,240,12]].map(([x,y,r],i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#0a1208" opacity="0.8"/>
          ))}
          {/* Bottom fade */}
          <rect x="0" y="240" width="390" height="100" fill="url(#fadeGrad)"/>
          <defs>
            <linearGradient id="fadeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="100%" stopColor="#0a0a0c"/>
            </linearGradient>
          </defs>
        </svg>

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: 'calc(env(safe-area-inset-top,0px) + 12px) 16px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 10,
        }}>
          <button
            onClick={() => navigate('/explore')}
            style={{
              background: 'rgba(10,10,12,0.75)',
              backdropFilter: 'blur(12px)',
              border: '0.5px solid rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: '8px 14px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font)',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{MOUNTAIN.name}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2} strokeLinecap="round" width={14} height={14}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="icon-btn" style={{ background: 'rgba(10,10,12,0.75)', backdropFilter: 'blur(12px)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width={18} height={18}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button className="icon-btn" style={{ background: 'rgba(10,10,12,0.75)', backdropFilter: 'blur(12px)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width={18} height={18}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mountain stats strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0 16px 12px',
          display: 'flex', gap: 8, alignItems: 'center',
          zIndex: 10,
        }}>
          {[
            { label: `${MOUNTAIN.openRuns}/${MOUNTAIN.totalRuns}`, sub: 'runs open' },
            { label: MOUNTAIN.snowDepth, sub: 'base depth' },
            { label: MOUNTAIN.temp, sub: 'summit' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(10,10,12,0.75)',
              backdropFilter: 'blur(10px)',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              padding: '5px 10px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{s.label}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Feature pins */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 8 }}>
          {FEATURES.map(f => (
            <FeaturePin key={f.id} feature={f} onTap={setActiveFeature} />
          ))}
        </div>

        {/* Feature sheet */}
        {activeFeature && (
          <FeatureSheet
            feature={activeFeature}
            onClose={() => setActiveFeature(null)}
            onView={(f) => { setActiveFeature(null); navigate(`/feature/${encodeURIComponent(f.name)}`); }}
            mountainName={MOUNTAIN.name}
          />
        )}
      </div>

      {/* Mountain picker */}
      {showPicker && (
        <MountainPicker
          current={activeMountainName}
          onSelect={(name) => { setActiveMountainName(name); setActiveFeature(null); setSportFilter('all'); }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* ── Scrollable content below map ──────────────────────── */}
      <div className="screen" style={{ paddingBottom: 'calc(var(--tab-height) + var(--safe-bottom))' }}>

        {/* ROTM */}
        <div style={{ padding: '20px 0 0' }}>
          <ROTMCard rotm={ROTM} onTap={() => navigate(`/user/${encodeURIComponent('@' + ROTM.user)}`)} />
        </div>

        {/* Top clips */}
        <div style={{ paddingTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px' }}>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px' }}>Top Clips</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['all','All'], ['ski','⛷️'], ['board','🏂']].map(([v, label]) => (
                <button
                  key={v}
                  className={`chip${sportFilter === v ? ' active' : ''}`}
                  style={{ padding: '4px 11px', fontSize: 12 }}
                  onClick={() => setSportFilter(v)}
                >{label}</button>
              ))}
            </div>
          </div>

          <div className="scroll-row" style={{ paddingBottom: 12 }}>
            {filteredClips.map(clip => (
              <ClipThumb
                key={clip.id}
                clip={clip}
                onCardTap={() => navigate(`/mountain/${encodeURIComponent(MOUNTAIN.name)}`)}
                onUserTap={(user) => navigate(`/user/${encodeURIComponent('@' + user)}`)}
              />
            ))}
          </div>
        </div>

        <div style={{ height: 8 }} />
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
