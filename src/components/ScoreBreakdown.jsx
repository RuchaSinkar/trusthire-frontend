export default function ScoreBreakdown({ breakdown, reasons }) {
  const labels = {
    domainAge:        'Domain age',
    linkedinPresence: 'LinkedIn presence',
    emailDomain:      'Email domain',
    communityReports: 'Community reports',
    trainingFee:      'Training fees',
    upfrontPayment:   'Upfront payment',
    personalDocs:     'Personal documents',
    urgencyLanguage:  'Urgency tactics',
    guaranteedJob:    'Guaranteed selection',
    vagueDescription: 'Vague description',
    highStipend:      'Unusually high stipend',
    codingRound:      'Coding round',
    structuredProcess:'Structured process',
  };

  const entries = Object.entries(breakdown).filter(([, v]) => v !== 0);

  return (
    <div style={{
      background: 'var(--bg3)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-head)', fontSize: '1rem',
        marginBottom: '1.25rem', color: 'var(--text)',
      }}>Score breakdown</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {entries.map(([key, value]) => {
          const isPos   = value > 0;
          const color   = isPos ? 'var(--green)' : value <= -30 ? 'var(--red)' : 'var(--amber)';
          const bgColor = isPos ? 'var(--green-bg)' : value <= -30 ? 'var(--red-bg)' : 'var(--amber-bg)';
          const barW    = Math.abs(value) / 40 * 100; // max signal is 40

          return (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--muted)' }}>
                  {labels[key] || key}
                </span>
                <span style={{
                  fontSize: '0.8rem', fontWeight: 600,
                  color, fontFamily: 'var(--font-head)',
                }}>
                  {isPos ? '+' : ''}{value}
                </span>
              </div>
              <div style={{
                height: 5, background: 'rgba(255,255,255,0.06)',
                borderRadius: 3, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${barW}%`,
                  background: color, borderRadius: 3,
                  transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reasons list */}
      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
        <h4 style={{
          fontSize: '0.825rem', color: 'var(--muted)',
          fontWeight: 500, marginBottom: '0.75rem',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>Detected signals</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {reasons.map((r, i) => {
            const isPos = r.includes('(+');
            const color = isPos ? 'var(--green)' : r.includes('(-3') ? 'var(--red)' : 'var(--amber)';
            return (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color, fontSize: '0.75rem', marginTop: 2, flexShrink: 0 }}>
                  {isPos ? '▲' : '▼'}
                </span>
                <span style={{ fontSize: '0.825rem', color: 'var(--muted)', lineHeight: 1.5 }}>{r}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}