import { useRef, useState, useEffect } from 'react';

const HOLD_MS = 300;     // press longer than this to open the slider
const COLLAPSE_MS = 1500; // slider closes this long after you let go

function VolumeIcon({ muted, volume }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
      {muted || volume === 0 ? (
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
        </>
      )}
    </svg>
  );
}

// Phones/tablets: like YouTube, loudness follows the device volume buttons and
// the in-app slider is off (iOS Safari ignores video.volume anyway).
export const deviceControlsVolume =
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

/**
 * Round volume button. Tap = mute/unmute. On desktop, press and hold expands
 * it into a vertical slider; keep holding and slide up/down to set the level.
 * Pass sliderEnabled={false} to force mute-only behaviour.
 */
export default function VolumeControl({ volume, muted, onVolumeChange, onMutedChange, sliderEnabled = !deviceControlsVolume }) {
  const [expanded, setExpanded] = useState(false);
  const holdTimer = useRef(null);
  const collapseTimer = useRef(null);
  const held = useRef(false);
  const startY = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => () => {
    clearTimeout(holdTimer.current);
    clearTimeout(collapseTimer.current);
  }, []);

  // Vertical track: bottom = 0, top = 1
  const setFromPointer = (clientY) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.height === 0) return;
    const v = Math.min(1, Math.max(0, (rect.bottom - clientY) / rect.height));
    onVolumeChange(v);
    onMutedChange(v === 0);
  };

  const onPointerDown = (e) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    clearTimeout(collapseTimer.current);
    held.current = false;
    startY.current = e.clientY;

    if (expanded) {
      // Already open: grabbing anywhere on it adjusts right away
      held.current = true;
      if (e.target.closest('.vol-track-hit')) setFromPointer(e.clientY);
      return;
    }
    // On phones the device's volume buttons control loudness, so no slider
    if (!sliderEnabled) return;
    holdTimer.current = setTimeout(() => {
      held.current = true;
      setExpanded(true);
    }, HOLD_MS);
  };

  const onPointerMove = (e) => {
    // Pressing and sliding opens the bar right away, without waiting for the hold
    if (!held.current && sliderEnabled && startY.current !== null && Math.abs(e.clientY - startY.current) > 6) {
      clearTimeout(holdTimer.current);
      held.current = true;
      setExpanded(true);
      return;
    }
    if (held.current && expanded) setFromPointer(e.clientY);
  };

  const onPointerUp = (e) => {
    e.stopPropagation();
    clearTimeout(holdTimer.current);
    startY.current = null;
    if (!held.current) {
      // Quick tap: toggle mute. Unmuting at 0 volume restores a usable level.
      if (muted && volume === 0) onVolumeChange(0.5);
      onMutedChange(!muted);
    }
    held.current = false;
    collapseTimer.current = setTimeout(() => setExpanded(false), COLLAPSE_MS);
  };

  const level = muted ? 0 : volume;

  return (
    <div
      className={`vol-control${expanded ? ' expanded' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={e => e.stopPropagation()}
      onContextMenu={e => e.preventDefault()}
      role="slider"
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(level * 100)}
    >
      <div className="vol-track-hit">
        <div className="vol-track" ref={trackRef}>
          <div className="vol-fill" style={{ height: `${level * 100}%` }} />
          <div className="vol-thumb" style={{ bottom: `${level * 100}%` }} />
        </div>
      </div>
      <div className="vol-button">
        <VolumeIcon muted={muted} volume={volume} />
      </div>
    </div>
  );
}
