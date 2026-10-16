import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/explore.css';

const MOUNTAINS = [
  {
    id: 'liberty',
    name: 'Liberty Mountain',
    location: 'Carroll Valley, PA',
    vertical: 620,
    runs: 22,
    temp: '28°F',
    snowDepth: '34"',
    open: true,
    emoji: '🏔️',
    conditions: 'Groomed',
    riders: 142,
    topRider: { name: 'Jake M.', avatar: '🏂', score: 9840 },
  },
  {
    id: 'roundtop',
    name: 'Roundtop Mountain',
    location: 'Lewisberry, PA',
    vertical: 600,
    runs: 16,
    temp: '26°F',
    snowDepth: '28"',
    open: true,
    emoji: '⛰️',
    conditions: 'Powder',
    riders: 98,
    topRider: { name: 'Sierra R.', avatar: '⛷️', score: 7210 },
  },
  {
    id: 'whitetail',
    name: 'Whitetail Resort',
    location: 'Mercersburg, PA',
    vertical: 935,
    runs: 23,
    temp: '24°F',
    snowDepth: '42"',
    open: false,
    emoji: '🌨️',
    conditions: 'Closed',
    riders: 0,
    topRider: null,
  },
];

const TOP_RIDERS = [
  { rank: 1, name: 'Ty B.', handle: '@tybanzai', avatar: '🏂', mountain: 'Liberty', score: 12400, sport: '🏂' },
  { rank: 2, name: 'Lex P.', handle: '@lexpow', avatar: '⛷️', mountain: 'Roundtop', score: 9980, sport: '⛷️' },
  { rank: 3, name: 'Jake M.', handle: '@jakemountain', avatar: '🏂', mountain: 'Liberty', score: 9840, sport: '🏂' },
  { rank: 4, name: 'Sierra R.', handle: '@sierrarips', avatar: '⛷️', mountain: 'Roundtop', score: 7210, sport: '⛷️' },
  { rank: 5, name: 'Maya K.', handle: '@mayakills', avatar: '🏂', mountain: 'Liberty', score: 6750, sport: '🏂' },
];

function MountainCard({ mountain, onTap }) {
  return (
    <button className="mountain-card" onClick={() => onTap(mountain)}>
      <div className="mountain-card-top">
        <div className="mountain-emoji">{mountain.emoji}</div>
        <div className="mountain-info">
          <div className="mountain-name">{mountain.name}</div>
          <div className="mountain-location">{mountain.location}</div>
        </div>
        <div className={`mountain-status ${mountain.open ? 'open' : 'closed'}`}>
          {mountain.open ? 'Open' : 'Closed'}
        </div>
      </div>
      {mountain.open && (
        <div className="mountain-stats-row">
          <div className="mountain-stat">
            <span className="mountain-stat-val">{mountain.runs}</span>
            <span className="mountain-stat-label">Runs</span>
          </div>
          <div className="mountain-stat">
            <span className="mountain-stat-val">{mountain.snowDepth}</span>
            <span className="mountain-stat-label">Snow</span>
          </div>
          <div className="mountain-stat">
            <span className="mountain-stat-val">{mountain.temp}</span>
            <span className="mountain-stat-label">Temp</span>
          </div>
          <div className="mountain-stat">
            <span className="mountain-stat-val">{mountain.riders}</span>
            <span className="mountain-stat-label">Riders</span>
          </div>
        </div>
      )}
    </button>
  );
}

function LeaderboardRow({ entry, onTap }) {
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <button className="lb-row" onClick={onTap} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left' }}>
      <span className="lb-rank">
        {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
      </span>
      <div className="avatar" style={{ width: 38, height: 38, fontSize: '1.2em' }}>{entry.avatar}</div>
      <div className="lb-info">
        <div className="lb-name">{entry.name}</div>
        <div className="lb-handle">{entry.handle} · {entry.sport} {entry.mountain}</div>
      </div>
      <div className="lb-score">{entry.score.toLocaleString()}</div>
    </button>
  );
}

export default function Explore() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('mountains'); // 'mountains' | 'leaderboard'
  const [search, setSearch] = useState('');

  const filtered = MOUNTAINS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="screen">
      <div style={{ paddingTop: 16 }}>
        <div className="page-header">
          <h1 className="page-title">Explore</h1>
        </div>

        {/* Search */}
        <div style={{ padding: '0 20px 16px' }}>
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16} style={{ flexShrink: 0, color: 'var(--fg-3)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="search-input"
              placeholder="Search mountains…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="explore-tabs">
          <button
            className={`explore-tab${tab === 'mountains' ? ' active' : ''}`}
            onClick={() => setTab('mountains')}
          >
            Mountains
          </button>
          <button
            className={`explore-tab${tab === 'leaderboard' ? ' active' : ''}`}
            onClick={() => setTab('leaderboard')}
          >
            🏆 Leaderboard
          </button>
        </div>

        {tab === 'mountains' && (
          <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(m => (
              <MountainCard
                key={m.id}
                mountain={m}
                onTap={() => navigate(`/?mountain=${encodeURIComponent(m.name)}`)}
              />
            ))}
          </div>
        )}

        {tab === 'leaderboard' && (
          <div style={{ padding: '12px 20px' }}>
            <div className="lb-header">
              <span className="section-title" style={{ padding: 0, paddingBottom: 4 }}>Top Riders — PA</span>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>This season</span>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {TOP_RIDERS.map((r, i) => (
                <div key={r.rank}>
                  <LeaderboardRow
                    entry={r}
                    onTap={() => navigate(`/user/${encodeURIComponent(r.handle)}`)}
                  />
                  {i < TOP_RIDERS.length - 1 && <div className="divider" style={{ margin: 0 }} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
