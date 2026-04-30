import { useState } from 'react';
import { checkCompany } from '../services/api';
import ScoreMeter from '../components/ScoreMeter';
import ScoreBreakdown from '../components/ScoreBreakdown';

const S = {
  page: { minHeight: '100vh', paddingTop: '60px' },
  hero: {
    maxWidth: 760, margin: '0 auto', padding: '5rem 2rem 3rem',
    textAlign: 'center',
  },
  tag: {
    display: 'inline-block', padding: '5px 14px',
    background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)',
    borderRadius: '100px', fontSize: '0.8rem', color: 'var(--accent2)',
    marginBottom: '1.5rem', fontWeight: 500,
  },
  h1: {
    fontFamily: 'var(--font-head)', fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
    fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem',
    letterSpacing: '-1px',
  },
  grad: {
    background: 'linear-gradient(135deg, #6c63ff 0%, #a78bfa 50%, #38bdf8 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  sub: {
    fontSize: '1.05rem', color: 'var(--muted)',
    maxWidth: 520, margin: '0 auto 3rem', lineHeight: 1.7,
  },
  form: {
    maxWidth: 700, margin: '0 auto', padding: '0 1.5rem 5rem',
    animation: 'fadeUp 0.5s ease both',
  },
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
  },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  label: {
    display: 'block', fontSize: '0.8rem', color: 'var(--muted)',
    marginBottom: '6px', fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  input: {
    width: '100%', padding: '11px 14px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', color: 'var(--text)',
    fontSize: '0.9rem', transition: 'border .2s',
  },
  textarea: {
    width: '100%', padding: '12px 14px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', color: 'var(--text)',
    fontSize: '0.875rem', resize: 'vertical', lineHeight: 1.6,
    minHeight: 140, transition: 'border .2s',
  },
  submitBtn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    border: 'none', borderRadius: 'var(--radius)',
    color: '#fff', fontFamily: 'var(--font-head)',
    fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', marginTop: '1.25rem',
    transition: 'opacity .2s, transform .1s',
    letterSpacing: '0.02em',
  },
  resultWrap: {
    maxWidth: 700, margin: '0 auto', padding: '0 1.5rem 5rem',
    animation: 'fadeUp 0.5s ease both',
  },
  resultGrid: {
    display: 'grid', gridTemplateColumns: '200px 1fr',
    gap: '1.5rem', alignItems: 'start',
  },
  meterCard: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  errorBox: {
    background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 'var(--radius)', padding: '12px 16px',
    color: 'var(--red)', fontSize: '0.875rem', marginTop: '1rem',
  },
  divider: {
    textAlign: 'center', padding: '3rem 0 1rem',
    fontSize: '0.8rem', color: 'var(--muted)',
    textTransform: 'uppercase', letterSpacing: '0.1em',
  },
  newCheck: {
    display: 'block', width: '100%', padding: '12px',
    background: 'transparent', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)', color: 'var(--muted)',
    fontFamily: 'var(--font-body)', fontSize: '0.875rem',
    cursor: 'pointer', marginBottom: '1.5rem',
    transition: 'all .2s',
  },
};

export default function Home() {
  const [form, setForm]       = useState({ companyName: '', website: '', email: '', jobText: '' });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.jobText.trim() && !form.website.trim()) {
      setError('Please paste the job description or enter the company website.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await checkCompany(form);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Is your backend running on port 8080?');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setForm({ companyName: '', website: '', email: '', jobText: '' }); };

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={S.hero} className="fade-up">
        <div style={S.tag}>Free · No signup required</div>
        <h1 style={S.h1}>
          Is that job offer<br />
          <span style={S.grad}>real or a scam?</span>
        </h1>
        <p style={S.sub}>
          Paste the offer letter or job description. TrustHire analyzes it instantly —
          domain age, email legitimacy, urgency tactics, and community reports.
        </p>
      </div>

      {/* Form */}
      {!result && (
        <div style={S.form}>
          <div style={S.card}>
            <form onSubmit={handleSubmit}>
              <div style={{ ...S.row2, marginBottom: '1rem' }}>
                <div>
                  <label style={S.label}>Company name</label>
                  <input name="companyName" value={form.companyName} onChange={handleChange}
                    placeholder="e.g. Zorvyn Technologies" style={S.input}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <div>
                  <label style={S.label}>Website URL</label>
                  <input name="website" value={form.website} onChange={handleChange}
                    placeholder="https://zorvyn.com" style={S.input}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={S.label}>Contact email (from offer letter)</label>
                <input name="email" value={form.email} onChange={handleChange}
                  placeholder="hr@zorvyn.com or hr@gmail.com" style={S.input}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={S.label}>Paste the job description or offer letter *</label>
                <textarea name="jobText" value={form.jobText} onChange={handleChange}
                  placeholder="Paste the full job description, offer letter, or any text from the company here..."
                  style={S.textarea}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {error && <div style={S.errorBox}>{error}</div>}

              <button type="submit" style={S.submitBtn}
                disabled={loading}
                onMouseEnter={e => e.target.style.opacity = '0.85'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{
                      width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite', display: 'inline-block',
                    }}/>
                    Analyzing...
                  </span>
                ) : 'Analyze this job posting →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={S.resultWrap}>
          <button style={S.newCheck}
            onClick={reset}
            onMouseEnter={e => { e.target.style.borderColor='var(--border2)'; e.target.style.color='var(--text)'; }}
            onMouseLeave={e => { e.target.style.borderColor='var(--border)'; e.target.style.color='var(--muted)'; }}
          >
            ← Check another posting
          </button>

          <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
            {result.companyName && <span>Results for <strong style={{ color: 'var(--text)' }}>{form.companyName}</strong> · </span>}
            Checked at {result.checkedAt}
          </div>

          <div style={S.resultGrid}>
            <div style={S.meterCard}>
              <ScoreMeter score={result.riskScore} />
            </div>
            <div>
              <div style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem',
                marginBottom: '1rem',
              }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                  {result.statusDescription}
                </p>
              </div>
              <ScoreBreakdown breakdown={result.scoreBreakdown} reasons={result.reasons} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}