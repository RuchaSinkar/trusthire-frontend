import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const S = {
  page: {
    minHeight: '100vh', paddingTop: '60px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  card: {
    width: '100%', maxWidth: 420, margin: '2rem',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '2.5rem',
    animation: 'fadeUp 0.4s ease both',
  },
  title: {
    fontFamily: 'var(--font-head)', fontSize: '1.8rem',
    fontWeight: 800, marginBottom: '0.5rem',
  },
  sub: { fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '2rem' },
  label: {
    display: 'block', fontSize: '0.78rem', color: 'var(--muted)',
    marginBottom: '6px', fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  input: {
    width: '100%', padding: '11px 14px', marginBottom: '1rem',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: '0.9rem',
    transition: 'border .2s',
  },
  btn: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    border: 'none', borderRadius: 'var(--radius)',
    color: '#fff', fontFamily: 'var(--font-head)',
    fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
    marginTop: '0.5rem', transition: 'opacity .2s',
  },
  err: {
    background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 'var(--radius)', padding: '10px 14px',
    color: 'var(--red)', fontSize: '0.825rem', marginBottom: '1rem',
  },
  footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--muted)' },
};

export default function Login() {
  const [form, setForm]       = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { loginUser }         = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await login(form);
      loginUser(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const focus  = (e) => e.target.style.borderColor = 'var(--accent)';
  const unfocus= (e) => e.target.style.borderColor = 'var(--border)';

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h1 style={S.title}>Welcome back</h1>
        <p style={S.sub}>Login to submit reports and view your history</p>

        {error && <div style={S.err}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={S.label}>Username</label>
          <input style={S.input} value={form.username} required
            onChange={e => setForm({...form, username: e.target.value})}
            onFocus={focus} onBlur={unfocus}
            placeholder="your username"
          />
          <label style={S.label}>Password</label>
          <input style={S.input} type="password" value={form.password} required
            onChange={e => setForm({...form, password: e.target.value})}
            onFocus={focus} onBlur={unfocus}
            placeholder="••••••••"
          />
          <button type="submit" style={S.btn} disabled={loading}
            onMouseEnter={e=>e.target.style.opacity='.85'}
            onMouseLeave={e=>e.target.style.opacity='1'}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <div style={S.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent2)', fontWeight: 500 }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}