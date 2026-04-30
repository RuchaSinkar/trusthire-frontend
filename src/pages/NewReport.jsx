import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReport } from '../services/api';

const S = {
  page: { minHeight: '100vh', paddingTop: '60px', maxWidth: 640, margin: '0 auto', padding: '80px 1.5rem 5rem' },
  title: { fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub:   { color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '2.5rem' },
  card:  {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '2rem',
    animation: 'fadeUp 0.4s ease both',
  },
  label: {
    display: 'block', fontSize: '0.78rem', color: 'var(--muted)',
    marginBottom: '6px', fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  hint: { fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '8px', opacity: 0.7 },
  input: {
    width: '100%', padding: '11px 14px', marginBottom: '1.25rem',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: '0.9rem',
    transition: 'border .2s',
  },
  textarea: {
    width: '100%', padding: '12px 14px', marginBottom: '1.25rem',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: '0.875rem',
    resize: 'vertical', lineHeight: 1.6, transition: 'border .2s',
  },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  btn: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    border: 'none', borderRadius: 'var(--radius)',
    color: '#fff', fontFamily: 'var(--font-head)',
    fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
    transition: 'opacity .2s',
  },
  err: {
    background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 'var(--radius)', padding: '10px 14px',
    color: 'var(--red)', fontSize: '0.825rem', marginBottom: '1rem',
  },
  ok: {
    background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: 'var(--radius)', padding: '10px 14px',
    color: 'var(--green)', fontSize: '0.825rem', marginBottom: '1rem',
  },
};

export default function NewReport() {
  const [form, setForm] = useState({
    companyName: '', domain: '', stipendOffered: '',
    description: '', experience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const set    = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const focus  = (e) => e.target.style.borderColor = 'var(--accent)';
  const unfocus= (e) => e.target.style.borderColor = 'var(--border)';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.description.length < 30) {
      setError('Please write at least 30 characters describing what happened');
      return;
    }
    setLoading(true); setError('');
    try {
      await createReport(form);
      setSuccess(true);
      setTimeout(() => navigate('/reports'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <h1 style={S.title} className="fade-up">Report a scam</h1>
      <p style={S.sub} className="fade-up">Your report helps other job seekers avoid the same trap.</p>

      <div style={S.card}>
        {error   && <div style={S.err}>{error}</div>}
        {success && <div style={S.ok}>Report submitted! Redirecting to community reports...</div>}

        <form onSubmit={handleSubmit}>
          <div style={S.row2}>
            <div>
              <label style={S.label}>Company name *</label>
              <input style={S.input} required value={form.companyName}
                onChange={set('companyName')} onFocus={focus} onBlur={unfocus}
                placeholder="e.g. Zorvyn Technologies"
              />
            </div>
            <div>
              <label style={S.label}>Website / Domain</label>
              <input style={S.input} value={form.domain}
                onChange={set('domain')} onFocus={focus} onBlur={unfocus}
                placeholder="zorvyn.com"
              />
            </div>
          </div>

          <label style={S.label}>Stipend they offered</label>
          <input style={S.input} value={form.stipendOffered}
            onChange={set('stipendOffered')} onFocus={focus} onBlur={unfocus}
            placeholder="e.g. 40,000"
          />

          <label style={S.label}>What happened? *</label>
          <p style={S.hint}>Describe the scam — how did they contact you, what red flags did you see?</p>
          <textarea style={{ ...S.textarea, minHeight: 120 }}
            required value={form.description}
            onChange={set('description')} onFocus={focus} onBlur={unfocus}
            placeholder="e.g. I received an offer letter from Zorvyn asking me to accept by midnight. They had no real interview process..."
          />

          <label style={S.label}>Your full experience (optional)</label>
          <p style={S.hint}>Timeline of events, what they asked you to do, how you found out it was a scam</p>
          <textarea style={{ ...S.textarea, minHeight: 100 }}
            value={form.experience}
            onChange={set('experience')} onFocus={focus} onBlur={unfocus}
            placeholder="First I got a LinkedIn DM... then they sent an offer letter... they asked me to pay..."
          />

          <button type="submit" style={S.btn} disabled={loading || success}
            onMouseEnter={e=>e.target.style.opacity='.85'}
            onMouseLeave={e=>e.target.style.opacity='1'}
          >
            {loading ? 'Submitting...' : 'Submit report →'}
          </button>
        </form>
      </div>
    </div>
  );
}