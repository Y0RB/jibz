import { useRef, useState, useEffect } from 'react';

function formatTime(s) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/**
 * Thin scrubbable progress bar for a <video>. Drag or tap anywhere on it to seek.
 * Calls onInteract on every touch so the parent can keep its controls visible.
 */
export default function VideoTimeline({ videoRef, onInteract }) {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const barRef = useRef(null);
  const wasPlaying = useRef(false);

  // Follow playback smoothly while the bar is on screen
  useEffect(() => {
    let raf;
    const tick = () => {
      const v = videoRef.current;
      if (v) {
        if (!scrubbing) setTime(v.currentTime);
        // Recorded WebM files can report Infinity until fully read
        if (isFinite(v.duration)) setDuration(v.duration);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [videoRef, scrubbing]);

  const seekTo = (clientX) => {
    const v = videoRef.current;
    const rect = barRef.current?.getBoundingClientRect();
    if (!v || !rect || !duration) return;
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    v.currentTime = pct * duration;
    setTime(pct * duration);
  };

  const onPointerDown = (e) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const v = videoRef.current;
    wasPlaying.current = v && !v.paused;
    v?.pause();
    setScrubbing(true);
    seekTo(e.clientX);
    onInteract?.();
  };

  const onPointerMove = (e) => {
    if (!scrubbing) return;
    seekTo(e.clientX);
    onInteract?.();
  };

  const onPointerUp = (e) => {
    e.stopPropagation();
    if (!scrubbing) return;
    setScrubbing(false);
    if (wasPlaying.current) videoRef.current?.play().catch(() => {});
    onInteract?.();
  };

  const pct = duration ? (time / duration) * 100 : 0;

  return (
    <div
      className={`video-timeline${scrubbing ? ' scrubbing' : ''}`}
      onClick={e => e.stopPropagation()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(time)}
    >
      <span className="video-timeline-time">{formatTime(time)}</span>
      <div className="video-timeline-bar" ref={barRef}>
        <div className="video-timeline-fill" style={{ width: `${pct}%` }} />
        <div className="video-timeline-thumb" style={{ left: `${pct}%` }} />
      </div>
      <span className="video-timeline-time">{formatTime(duration)}</span>
    </div>
  );
}
