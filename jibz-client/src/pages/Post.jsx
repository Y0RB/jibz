import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch, getCurrentUser } from '../api';
import '../styles/profile.css';

const FEATURES = [
  'Central Park Rail', 'Flat Bar', 'Kicker Line', 'Big Air', 'Halfpipe',
  'Hip Jump', 'Box', 'Down Rail', 'Butter Box', 'Spine',
];

// Chip label -> API SportType enum (0 = Snowboarder, 1 = Skier)
const SPORTS = { '🏂 Snowboard': 0, '⛷️ Ski': 1 };

export default function Post() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [step, setStep] = useState(1); // 1: upload, 2: details, 3: done
  const [form, setForm] = useState({
    mountainId: '',
    feature: '',
    trick: '',
    caption: '',
    difficulty: '',
    sport: '',
  });
  const [board, setBoard] = useState('');
  const [boots, setBoots] = useState('');
  const [bindings, setBindings] = useState('');
  const [mountains, setMountains] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  useEffect(() => {
    apiFetch('/api/mountains')
      .then(list => {
        setMountains(list);
        if (list.length) setForm(f => ({ ...f, mountainId: f.mountainId || String(list[0].id) }));
      })
      .catch(() => setError("Couldn't load mountains. Is the API running?"));
  }, []);

  // Free the preview blob when the video changes or the page closes
  useEffect(() => () => videoPreview && URL.revokeObjectURL(videoPreview), [videoPreview]);

  const pickVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    setError('');
  };

  const submit = async () => {
    setPosting(true);
    setError('');
    const body = new FormData();
    body.append('video', video);
    body.append('mountainId', form.mountainId);
    body.append('feature', form.feature);
    body.append('difficulty', form.difficulty);
    body.append('sport', SPORTS[form.sport]);
    body.append('trick', form.trick);
    body.append('caption', form.caption);
    body.append('board', board);
    body.append('boots', boots);
    body.append('bindings', bindings);
    try {
      await apiFetch('/api/clips/upload', { method: 'POST', body });
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  if (!user) {
    return (
      <div className="screen">
        <div className="post-success">
          <div className="post-success-icon">🔒</div>
          <h2 className="post-success-title">Log in to post</h2>
          <p className="post-success-sub">You need an account to upload clips.</p>
          <Link to="/login" className="btn-primary" style={{ maxWidth: 280, textAlign: 'center', textDecoration: 'none' }}>
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="screen">
        <div className="post-success">
          <div className="post-success-icon">🔥</div>
          <h2 className="post-success-title">Clip Posted!</h2>
          <p className="post-success-sub">Your clip is live. Time to get the bag.</p>
          <button className="btn-primary" style={{ maxWidth: 280 }} onClick={() => navigate('/profile')}>
            View on Profile
          </button>
          <button className="btn-ghost" style={{ maxWidth: 280, marginTop: 12 }} onClick={() => navigate('/')}>
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div style={{ paddingTop: 16 }}>
        <div className="page-header">
          <button className="back-btn" onClick={() => step === 1 ? navigate(-1) : setStep(1)}>
            <svg viewBox="0 0 10 18" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 1 1 9 9 17"/>
            </svg>
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <span className="page-title-sm">Post Clip</span>
          <span style={{ width: 60 }} />
        </div>

        {/* Progress */}
        <div className="post-progress">
          <div className={`post-step${step >= 1 ? ' done' : ''}`} />
          <div className="post-step-line" />
          <div className={`post-step${step >= 2 ? ' done' : ''}`} />
        </div>

        {step === 1 && (
          <div style={{ padding: '24px 20px' }}>
            {/* Upload zone */}
            <div className="upload-zone" style={videoPreview ? { padding: 0, overflow: 'hidden' } : undefined}>
              {videoPreview ? (
                <video src={videoPreview} muted loop autoPlay playsInline style={{ width: '100%', maxHeight: 320, display: 'block', objectFit: 'cover' }} />
              ) : (
                <>
                  <div className="upload-icon">🎬</div>
                  <div className="upload-label">Tap to select a clip</div>
                  <div className="upload-sub">MP4 or MOV · max 60s</div>
                </>
              )}
              <input type="file" accept="video/*" onChange={pickVideo} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            </div>
            {video && (
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8, textAlign: 'center' }}>
                {video.name} · tap the video to change it
              </div>
            )}

            <div className="field" style={{ marginTop: 24 }}>
              <label>Mountain</label>
              <select value={form.mountainId} onChange={e => update('mountainId', e.target.value)}>
                {mountains.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            {error && <div style={{ color: '#e24b4a', fontSize: 13, marginBottom: 12 }}>{error}</div>}

            <button
              className="btn-primary"
              disabled={!video || !form.mountainId}
              onClick={() => setStep(2)}
            >
              Next — Add Details
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ padding: '24px 20px' }}>
            <div className="field">
              <label>Feature</label>
              <select value={form.feature} onChange={e => update('feature', e.target.value)}>
                <option value="">Select feature…</option>
                {FEATURES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Sport</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['🏂 Snowboard', '⛷️ Ski'].map(s => (
                  <button
                    key={s}
                    className={`chip${form.sport === s ? ' active' : ''}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => update('sport', s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Difficulty</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['beginner', 'intermediate', 'expert'].map(d => (
                  <button
                    key={d}
                    className={`diff-badge ${d}${form.difficulty === d ? '' : ' dim'}`}
                    style={{ flex: 1, justifyContent: 'center', cursor: 'pointer', border: form.difficulty === d ? '1.5px solid currentColor' : '1.5px solid transparent', opacity: form.difficulty === d ? 1 : 0.5 }}
                    onClick={() => update('difficulty', d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Trick</label>
              <input placeholder="e.g. Backside 180" value={form.trick} onChange={e => update('trick', e.target.value)} />
            </div>

            <div className="field">
              <label>Caption</label>
              <textarea
                rows={3}
                placeholder="What happened on this feature?"
                value={form.caption}
                onChange={e => update('caption', e.target.value)}
              />
            </div>

            {/* Gear (optional) */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                Gear (optional)
              </div>
              <div className="field">
                <label>Board / Skis</label>
                <input placeholder="e.g. Burton Custom 158" value={board} onChange={e => setBoard(e.target.value)} />
              </div>
              <div className="field">
                <label>Boots</label>
                <input placeholder="e.g. ThirtyTwo TM-3" value={boots} onChange={e => setBoots(e.target.value)} />
              </div>
              <div className="field">
                <label>Bindings / Poles</label>
                <input placeholder="e.g. Union Atlas" value={bindings} onChange={e => setBindings(e.target.value)} />
              </div>
            </div>

            {error && <div style={{ color: '#e24b4a', fontSize: 13, marginBottom: 12 }}>{error}</div>}

            <button
              className="btn-primary"
              disabled={!form.feature || !form.sport || !form.difficulty || posting}
              onClick={submit}
            >
              {posting ? 'Uploading…' : 'Post Clip 🔥'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
