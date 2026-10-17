import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch, getCurrentUser, SPORT_EMOJI } from '../api';
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

const MY_GEAR = { board: 'Never Summer Proto Synthesis 156', boots: 'ThirtyTwo TM-3 Lace', bindings: 'Union Atlas' };

// Convert a clip from GET /api/clips/user/{id} into the grid shape used here
function fromApiClip(c, profile) {
  const gear = {};
  if (c.board) gear.board = c.board;
  if (c.boots) gear.boots = c.boots;
  if (c.bindings) gear.bindings = c.bindings;
  return {
    id: c.id,
    emoji: SPORT_EMOJI[c.sport] || '🏂',
    feature: c.feature,
    likes: c.likes,
    diff: c.difficulty,
    trick: c.trick,
    caption: c.caption,
    comments: c.comments,
    mountain: c.mountain,
    videoUrl: c.videoUrl,
    ownerId: c.userId,
    user: { name: profile.name, handle: profile.handle, avatar: profile.avatar },
    gear,
  };
}

// Expand a grid clip into the full shape UserClips' reel cards render
function toReelClip(clip, profile) {
  return {
    id: clip.id,
    user: clip.user || { name: profile.name, handle: profile.handle, avatar: profile.avatar },
    mountain: clip.mountain || profile.mountain,
    feature: clip.feature,
    trick: clip.trick || clip.feature,
    caption: clip.caption || '',
    sport: clip.emoji,
    difficulty: clip.diff,
    likes: clip.likes,
    comments: clip.comments || 0,
    saves: clip.saves || 0,
    videoUrl: clip.videoUrl,
    ownerId: clip.ownerId,
    trickName: clip.trick || '',
    captionText: clip.caption || '',
    bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    gear: clip.gear || MY_GEAR,
  };
}

function ClipGrid({ clips, title, profile }) {
  const navigate = useNavigate();

  const openClip = (index) => {
    navigate(`/user/${encodeURIComponent(profile.handle)}/clips`, {
      state: { clips: clips.map(c => toReelClip(c, profile)), startIndex: index, title },
    });
  };

  return (
    <div className="clip-grid">
      {clips.map((clip, i) => (
        <button key={clip.id} className="clip-grid-item" onClick={() => openClip(i)}>
          {clip.videoUrl ? (
            <video
              src={`${clip.videoUrl}#t=0.1`}
              muted
              playsInline
              preload="metadata"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span className="clip-grid-emoji">{clip.emoji}</span>
          )}
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
  const me = getCurrentUser();
  // Logged in: real name and clips from the API. Logged out: the sample profile.
  const profile = me ? { ...USER, name: me.username, handle: `@${me.username}` } : USER;
  const [myClips, setMyClips] = useState(me ? [] : MY_CLIPS);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!me) return;
    apiFetch(`/api/clips/user/${me.id}`)
      .then(list => setMyClips(list.map(c => fromApiClip(c, profile))))
      .catch(err => setLoadError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id]);

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
          <div className="profile-avatar">{profile.avatar}</div>
          <div className="profile-name">{profile.name}</div>
          <div className="profile-handle">{profile.handle}</div>
          <div className="profile-meta">{profile.sport} · {profile.mountain}</div>
          <p className="profile-bio">{profile.bio}</p>

          {/* Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-val">{me ? myClips.length : USER.clips}</span>
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

        {tab === 'clips' && (
          <>
            {!me && (
              <div style={{ padding: '12px 20px', fontSize: 13, color: 'var(--fg-3)', textAlign: 'center' }}>
                You're not logged in. This is a sample profile. <Link to="/login" style={{ color: 'var(--accent)' }}>Log in</Link> to see yours.
              </div>
            )}
            {loadError && <div style={{ padding: '12px 20px', fontSize: 13, color: '#e24b4a' }}>{loadError}</div>}
            {me && !loadError && myClips.length === 0 && (
              <div style={{ padding: '32px 20px', fontSize: 14, color: 'var(--fg-3)', textAlign: 'center' }}>
                No clips yet. <Link to="/post" style={{ color: 'var(--accent)' }}>Post your first one</Link>
              </div>
            )}
            <ClipGrid clips={myClips} title="My Clips" profile={profile} />
          </>
        )}
        {tab === 'saved' && <ClipGrid clips={SAVED_CLIPS} title="Saved" profile={profile} />}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="gear-panel" onClick={() => setEditing(false)}>
          <div className="gear-panel-inner" onClick={e => e.stopPropagation()}>
            <div className="gear-handle" />
            <h3 className="gear-title">Edit Profile</h3>
            <div className="field">
              <label>Display Name</label>
              <input defaultValue={profile.name} placeholder="Your name" />
            </div>
            <div className="field">
              <label>Handle</label>
              <input defaultValue={profile.handle} placeholder="@handle" />
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
