import { useState } from 'react';
import '../styles/profile.css';

const USER = {
  name: 'You',
  handle: '@yourhandle',
  avatar: '🏂',
  mountain: 'Liberty Mountain',
  sport: 'Snowboard',
  followers: 284,
  following: 91,
  clips: 17,
  score: 4320,
  bio: 'Liberty local. Jibbing rails since 2019. PA snow is different 🤙',
  badges: ['🥉 Season Top 10', '🔥 5-Day Streak', '⭐ First Clip'],
};

const MY_CLIPS = [
  { id: 1, emoji: '🏂', feature: 'Flat Bar', likes: 312, diff: 'intermediate' },
  { id: 2, emoji: '🏂', feature: 'Kicker', likes: 198, diff: 'expert' },
  { id: 3, emoji: '🏂', feature: 'Box', likes: 87, diff: 'beginner' },
  { id: 4, emoji: '🏂', feature: 'Rail', likes: 445, diff: 'expert' },
  { id: 5, emoji: '🏂', feature: 'Hip', likes: 231, diff: 'intermediate' },
  { id: 6, emoji: '🏂', feature: 'Pipe', likes: 167, diff: 'intermediate' },
];

const SAVED_CLIPS = [
  { id: 7, emoji: '⛷️', feature: 'Halfpipe', likes: 934, diff: 'intermediate' },
  { id: 8, emoji: '🏂', feature: 'Central Park Rail', likes: 1842, diff: 'expert' },
  { id: 9, emoji: '⛷️', feature: 'Big Air', likes: 2109, diff: 'expert' },
];

function ClipGrid({ clips }) {
  return (
    <div className="clip-grid">
      {clips.map(clip => (
        <button key={clip.id} className="clip-grid-item">
          <span className="clip-grid-emoji">{clip.emoji}</span>
          <div className="clip-grid-overlay">
            <span className="clip-grid-likes">♥ {clip.likes}</span>
          </div>
          <div className={`diff-badge ${clip.diff}`} style={{ position: 'absolute', top: 6, left: 6, fontSize: 9, padding: '2px 6px' }}>
            {clip.diff.slice(0, 3)}
          </div>
        </button>
      ))}
    </div>
  );
}

export default function Profile() {
  const [tab, setTab] = useState('clips'); // 'clips' | 'saved'
  const [editing, setEditing] = useState(false);

  return (
    <div className="screen">
      <div style={{ paddingTop: 16 }}>
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Profile</h1>
          <button className="icon-btn" onClick={() => setEditing(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>

        {/* Avatar + info */}
        <div className="profile-hero">
          <div className="profile-avatar">{USER.avatar}</div>
          <div className="profile-name">{USER.name}</div>
          <div className="profile-handle">{USER.handle}</div>
          <div className="profile-meta">{USER.sport} · {USER.mountain}</div>
          <p className="profile-bio">{USER.bio}</p>

          {/* Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-val">{USER.clips}</span>
              <span className="profile-stat-label">Clips</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat">
              <span className="profile-stat-val">{USER.followers}</span>
              <span className="profile-stat-label">Followers</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat">
              <span className="profile-stat-val">{USER.following}</span>
              <span className="profile-stat-label">Following</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat">
              <span className="profile-stat-val" style={{ color: 'var(--accent)' }}>{USER.score.toLocaleString()}</span>
              <span className="profile-stat-label">Score</span>
            </div>
          </div>

          {/* Badges */}
          <div className="profile-badges">
            {USER.badges.map((b, i) => (
              <span key={i} className="profile-badge">{b}</span>
            ))}
          </div>
        </div>

        {/* Clip tabs */}
        <div className="explore-tabs" style={{ marginBottom: 0 }}>
          <button className={`explore-tab${tab === 'clips' ? ' active' : ''}`} onClick={() => setTab('clips')}>
            My Clips
          </button>
          <button className={`explore-tab${tab === 'saved' ? ' active' : ''}`} onClick={() => setTab('saved')}>
            Saved
          </button>
        </div>

        {tab === 'clips' && <ClipGrid clips={MY_CLIPS} />}
        {tab === 'saved' && <ClipGrid clips={SAVED_CLIPS} />}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="gear-panel" onClick={() => setEditing(false)}>
          <div className="gear-panel-inner" onClick={e => e.stopPropagation()}>
            <div className="gear-handle" />
            <h3 className="gear-title">Edit Profile</h3>
            <div className="field">
              <label>Display Name</label>
              <input defaultValue={USER.name} placeholder="Your name" />
            </div>
            <div className="field">
              <label>Handle</label>
              <input defaultValue={USER.handle} placeholder="@handle" />
            </div>
            <div className="field">
              <label>Bio</label>
              <textarea rows={3} defaultValue={USER.bio} />
            </div>
            <div className="field">
              <label>Home Mountain</label>
              <input defaultValue={USER.mountain} placeholder="Mountain name" />
            </div>
            <button className="btn-primary" onClick={() => setEditing(false)}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
