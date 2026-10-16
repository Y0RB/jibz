import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

const FEATURES = [
  'Central Park Rail', 'Flat Bar', 'Kicker Line', 'Big Air', 'Halfpipe',
  'Hip Jump', 'Box', 'Down Rail', 'Butter Box', 'Spine',
];

export default function Post() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: upload, 2: details, 3: done
  const [form, setForm] = useState({
    mountain: 'Liberty Mountain',
    feature: '',
    caption: '',
    difficulty: '',
    sport: '',
  });
  const [board, setBoard] = useState('');
  const [boots, setBoots] = useState('');
  const [bindings, setBindings] = useState('');
  const [outerwear, setOuterwear] = useState('');

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (step === 3) {
    return (
      <div className="screen">
        <div className="post-success">
          <div className="post-success-icon">🔥</div>
          <h2 className="post-success-title">Clip Posted!</h2>
          <p className="post-success-sub">Your clip is live. Time to get the bag.</p>
          <button className="btn-primary" style={{ maxWidth: 280 }} onClick={() => navigate('/reels')}>
            Watch Reels
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
            <div className="upload-zone">
              <div className="upload-icon">🎬</div>
              <div className="upload-label">Tap to select a clip</div>
              <div className="upload-sub">MP4 or MOV · max 60s</div>
              <input type="file" accept="video/*" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            </div>

            <div className="field" style={{ marginTop: 24 }}>
              <label>Mountain</label>
              <select value={form.mountain} onChange={e => update('mountain', e.target.value)}>
                <option>Liberty Mountain</option>
                <option>Roundtop Mountain</option>
                <option>Whitetail Resort</option>
              </select>
            </div>

            <button
              className="btn-primary"
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
              <div className="field">
                <label>Outerwear</label>
                <input placeholder="e.g. Volcom L Gore-Tex" value={outerwear} onChange={e => setOuterwear(e.target.value)} />
              </div>
            </div>

            <button
              className="btn-primary"
              disabled={!form.feature || !form.sport || !form.difficulty}
              onClick={() => setStep(3)}
            >
              Post Clip 🔥
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
