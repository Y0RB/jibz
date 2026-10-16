import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/profile.css';

// Mock user data — keyed by handle
const USERS = {
  '@jakemountain': {
    name: 'Jake M.',
    handle: '@jakemountain',
    avatar: '🏂',
    mountain: 'Liberty Mountain',
    sport: 'Snowboard',
    followers: 1204,
    following: 87,
    score: 9840,
    bio: 'Liberty local. Rails are life 🛹 Backside 180s till I die.',
    badges: ['🥇 Season #1 Rail', '🔥 10-Day Streak'],
    clips: [
      { id: 1, emoji: '🏂', feature: 'Down Rail', likes: 247, diff: 'intermediate' },
      { id: 2, emoji: '🏂', feature: 'Flat Bar', likes: 1842, diff: 'expert' },
      { id: 3, emoji: '🏂', feature: 'Rainbow Box', likes: 211, diff: 'intermediate' },
      { id: 4, emoji: '🏂', feature: 'Big Kicker', likes: 189, diff: 'intermediate' },
    ],
  },
  '@sierrarips': {
    name: 'Sierra R.',
    handle: '@sierrarips',
    avatar: '⛷️',
    mountain: 'Roundtop Mountain',
    sport: 'Ski',
    followers: 832,
    following: 120,
    score: 7210,
    bio: 'Park skier. Roundtop is home ⛷️ Front 7s and jib lines.',
    badges: ['🥈 Roundtop Top Rider', '⭐ Most Saved Clip'],
    clips: [
      { id: 5, emoji: '⛷️', feature: 'Halfpipe', likes: 934, diff: 'intermediate' },
      { id: 6, emoji: '⛷️', feature: 'Liberty Pipe', likes: 512, diff: 'intermediate' },
      { id: 7, emoji: '⛷️', feature: 'Rainbow Box', likes: 134, diff: 'beginner' },
    ],
  },
  '@tybanzai': {
    name: 'Ty B.',
    handle: '@tybanzai',
    avatar: '🏂',
    mountain: 'Liberty Mountain',
    sport: 'Snowboard',
    followers: 3841,
    following: 44,
    score: 12400,
    bio: 'Biggest sends in PA 🤙 Cab 9s and backcountry finds.',
    badges: ['🥇 PA Season #1', '🔥 Rider of the Month', '💥 Most Viral Clip'],
    clips: [
      { id: 8, emoji: '🏂', feature: 'Big Kicker', likes: 3201, diff: 'expert' },
      { id: 9, emoji: '🏂', feature: 'Liberty Pipe', likes: 2800, diff: 'expert' },
      { id: 10, emoji: '🏂', feature: 'Down Rail', likes: 1100, diff: 'expert' },
      { id: 11, emoji: '🏂', feature: 'Flat Bar', likes: 890, diff: 'expert' },
      { id: 12, emoji: '🏂', feature: 'Big Kicker', likes: 650, diff: 'expert' },
      { id: 13, emoji: '🏂', feature: 'Liberty Pipe', likes: 420, diff: 'expert' },
    ],
  },
  '@lexpow': {
    name: 'Lex P.',
    handle: '@lexpow',
    avatar: '⛷️',
    mountain: 'Roundtop Mountain',
    sport: 'Ski',
    followers: 2109,
    following: 61,
    score: 9980,
    bio: 'Switch corks and survival 🙏 Roundtop since 2016.',
    badges: ['🥈 Roundtop Top 3', '🎯 Best Trick Award'],
    clips: [
      { id: 14, emoji: '⛷️', feature: 'Big Kicker', likes: 2109, diff: 'expert' },
      { id: 15, emoji: '⛷️', feature: 'Liberty Pipe', likes: 1800, diff: 'expert' },
      { id: 16, emoji: '⛷️', feature: 'Rainbow Box', likes: 300, diff: 'intermediate' },
    ],
  },
  '@liberty_mike': {
    name: 'Mike K.',
    handle: '@liberty_mike',
    avatar: '🎿',
    mountain: 'Liberty Mountain',
    sport: 'Ski',
    followers: 512,
    following: 200,
    score: 4100,
    bio: 'Cork 720s every day. Liberty Mountain die-hard.',
    badges: ['⭐ First Clip'],
    clips: [
      { id: 17, emoji: '⛷️', feature: 'Big Kicker', likes: 512, diff: 'expert' },
      { id: 18, emoji: '⛷️', feature: 'Flat Bar', likes: 198, diff: 'intermediate' },
    ],
  },
  '@mayakills': {
    name: 'Maya K.',
    handle: '@mayakills',
    avatar: '🏂',
    mountain: 'Liberty Mountain',
    sport: 'Snowboard',
    followers: 675,
    following: 130,
    score: 6750,
    bio: 'Jibbing everything in sight 🏂 Liberty park everyday.',
    badges: ['🥉 Season Top 10'],
    clips: [
      { id: 19, emoji: '🏂', feature: 'Flat Bar', likes: 312, diff: 'beginner' },
      { id: 20, emoji: '🏂', feature: 'Rainbow Box', likes: 189, diff: 'beginner' },
      { id: 21, emoji: '🏂', feature: 'Down Rail', likes: 445, diff: 'expert' },
      { id: 22, emoji: '🏂', feature: 'Big Kicker', likes: 231, diff: 'intermediate' },
    ],
  },
};

// Fallback for unknown handles
const FALLBACK = {
  name: 'Rider',
  handle: '',
  avatar: '🏂',
  mountain: 'Liberty Mountain',
  sport: 'Snowboard',
  followers: 0,
  following: 0,
  score: 0,
  bio: 'New to Jibz.',
  badges: [],
  clips: [],
};

export default function UserProfile() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);

  const user = USERS[decodeURIComponent(handle)] || { ...FALLBACK, handle: decodeURIComponent(handle) };

  return (
    <div className="screen">
      <div style={{ paddingTop: 16 }}>

        {/* Header with back */}
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 10 18" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 1 1 9 9 17"/>
            </svg>
            Back
          </button>
          <span className="page-title-sm">{user.handle}</span>
          <span style={{ width: 60 }} />
        </div>

        {/* Profile hero */}
        <div className="profile-hero">
          <div className="profile-avatar">{user.avatar}</div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-handle">{user.handle}</div>
          <div className="profile-meta">{user.sport} · {user.mountain}</div>
          <p className="profile-bio">{user.bio}</p>

          {/* Follow button */}
          <button
            className={`btn-follow${following ? ' following' : ''}`}
            style={{ padding: '10px 40px', fontSize: 15, marginTop: 4 }}
            onClick={() => setFollowing(p => !p)}
          >
            {following ? 'Following' : 'Follow'}
          </button>

          {/* Stats */}
          <div className="profile-stats" style={{ marginTop: 16 }}>
            <div className="profile-stat">
              <span className="profile-stat-val">{user.clips.length}</span>
              <span className="profile-stat-label">Clips</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat">
              <span className="profile-stat-val">{user.followers >= 1000 ? (user.followers / 1000).toFixed(1) + 'k' : user.followers}</span>
              <span className="profile-stat-label">Followers</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat">
              <span className="profile-stat-val">{user.following}</span>
              <span className="profile-stat-label">Following</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat">
              <span className="profile-stat-val" style={{ color: 'var(--accent)' }}>{user.score.toLocaleString()}</span>
              <span className="profile-stat-label">Score</span>
            </div>
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div className="profile-badges">
              {user.badges.map((b, i) => (
                <span key={i} className="profile-badge">{b}</span>
              ))}
            </div>
          )}
        </div>

        {/* Clips grid */}
        {user.clips.length > 0 ? (
          <>
            <div style={{ padding: '4px 20px 10px', fontSize: 16, fontWeight: 700, color: 'var(--fg)' }}>
              Clips
            </div>
            <div className="clip-grid">
              {user.clips.map(clip => (
                <button
                  key={clip.id}
                  className="clip-grid-item"
                  onClick={() => navigate(`/user/${encodeURIComponent(user.handle)}/clips`)}
                >
                  <span className="clip-grid-emoji">{clip.emoji}</span>
                  <div className="clip-grid-overlay">
                    <span className="clip-grid-likes">♥ {clip.likes >= 1000 ? (clip.likes / 1000).toFixed(1) + 'k' : clip.likes}</span>
                  </div>
                  <div className={`diff-badge ${clip.diff}`} style={{ position: 'absolute', top: 6, left: 6, fontSize: 9, padding: '2px 6px' }}>
                    {clip.diff.slice(0, 3)}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)' }}>
            <div style={{ fontSize: 36 }}>🎬</div>
            <div style={{ marginTop: 8, fontSize: 14 }}>No clips yet</div>
          </div>
        )}

      </div>
    </div>
  );
}
