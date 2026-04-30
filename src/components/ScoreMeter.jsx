import { useEffect, useState } from 'react';

export default function ScoreMeter({ score, verdict }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = () => {
      start += 2;
      if (start >= score) { setDisplayed(score); return; }
      setDisplayed(start);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  const color  = score >= 70 ? 'var(--green)' : score >= 40 ? 'var(--amber)' : 'var(--red)';
  const bgColor= score >= 70 ? 'var(--green-bg)' : score >= 40 ? 'var(--amber-bg)' : 'var(--red-bg)';
  const label  = score >= 70 ? 'Likely Genuine' : score >= 40 ? 'Suspicious' : 'Likely Scam';

  // SVG circle math
  const r = 54;
  const circ = 2 * Math.PI * r;
  const progress = circ - (displayed / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        {/* Pulse ring behind circle */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: color, opacity: 0.08,
          animation: 'pulse-ring 2s ease-out infinite',
        }}/>
        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="80" cy="80" r={r} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
          {/* Progress */}
          <circle cx="80" cy="80" r={r} fill="none"
            stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={progress}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        {/* Score in center */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-head)', fontSize: '2.2rem',
            fontWeight: 800, color, lineHeight: 1,
          }}>{displayed}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>/ 100</span>
        </div>
      </div>

      {/* Verdict badge */}
      <div style={{
        padding: '6px 20px', borderRadius: '100px',
        background: bgColor, border: `1px solid ${color}`,
        color, fontWeight: 600, fontSize: '0.9rem',
        fontFamily: 'var(--font-head)',
      }}>
        {score >= 70 ? '✓' : score >= 40 ? '⚠' : '✕'} {label}
      </div>
    </div>
  );
}