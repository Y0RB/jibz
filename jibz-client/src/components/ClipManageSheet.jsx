import { useState } from 'react';
import { apiFetch } from '../api';

/**
 * Bottom sheet for the owner of a clip: edit trick/caption or delete it.
 * Uses PATCH / DELETE /api/clips/mine/{id}. Reuses the gear-panel sheet styles.
 */
export default function ClipManageSheet({ clip, onClose, onUpdated, onDeleted, onBeforeDelete, onDeleteFailed }) {
  const [mode, setMode] = useState('menu'); // 'menu' | 'edit' | 'confirm-delete'
  const [trick, setTrick] = useState(clip.trickName || '');
  const [caption, setCaption] = useState(clip.captionText || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      const updated = await apiFetch(`/api/clips/mine/${clip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trick, caption }),
      });
      onUpdated({
        trick: updated.trick || updated.feature,
        caption: updated.caption || '',
        trickName: updated.trick || '',
        captionText: updated.caption || '',
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setError('');
    // Stop streaming first so the server can remove the file right away
    onBeforeDelete?.();
    try {
      await apiFetch(`/api/clips/mine/${clip.id}`, { method: 'DELETE' });
      onDeleted();
    } catch (err) {
      onDeleteFailed?.();
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="gear-panel" onClick={busy ? undefined : onClose}>
      <div className="gear-panel-inner" onClick={e => e.stopPropagation()}>
        <div className="gear-handle" />

        {mode === 'menu' && (
          <>
            <h3 className="gear-title">Your Clip</h3>
            <button className="manage-option" onClick={() => setMode('edit')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit trick &amp; caption
            </button>
            <button className="manage-option danger" onClick={() => setMode('confirm-delete')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/>
              </svg>
              Delete clip
            </button>
            <button className="btn-ghost" style={{ marginTop: 8 }} onClick={onClose}>Cancel</button>
          </>
        )}

        {mode === 'edit' && (
          <>
            <h3 className="gear-title">Edit Clip</h3>
            <div className="field">
              <label>Trick</label>
              <input value={trick} onChange={e => setTrick(e.target.value)} placeholder="e.g. Backside 180" maxLength={80} />
            </div>
            <div className="field">
              <label>Caption</label>
              <textarea rows={3} value={caption} onChange={e => setCaption(e.target.value)} placeholder="What happened on this feature?" maxLength={300} />
            </div>
            {error && <div className="manage-error">{error}</div>}
            <button className="btn-primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
            <button className="btn-ghost" style={{ marginTop: 8 }} disabled={busy} onClick={() => setMode('menu')}>Back</button>
          </>
        )}

        {mode === 'confirm-delete' && (
          <>
            <h3 className="gear-title">Delete this clip?</h3>
            <p className="manage-warning">This removes the video, its likes and its comments. It can't be undone.</p>
            {error && <div className="manage-error">{error}</div>}
            <button className="btn-primary manage-delete-btn" disabled={busy} onClick={remove}>{busy ? 'Deleting…' : 'Delete'}</button>
            <button className="btn-ghost" style={{ marginTop: 8 }} disabled={busy} onClick={() => setMode('menu')}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}
