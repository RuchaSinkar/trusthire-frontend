import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const S = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(10,10,15,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '0 2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '60px',
  },
  logo: {
    fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.2rem',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  links: { display: 'flex', alignItems: 'center', gap: '2rem' },
  link: { fontSize: '0.875rem', color: 'var(--muted)', transition: 'color .2s', fontWeight: 500 },
  linkActive: { color: 'var(--text)' },
  btn: {
    padding: '7px 18px', borderRadius: '8px', fontSize: '0.875rem',
    fontWeight: 500, cursor: 'pointer', transition: 'all .2s',
  },
  loginBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'var(--text)',
  },
  registerBtn: {
    background: 'var(--accent)',
    border: '1px solid var(--accent)',
    color: '#fff',
  },
  user: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    fontSize: '0.875rem', color: 'var(--muted)',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'var(--muted)', padding: '6px 14px',
    borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer',
    transition: 'all .2s',
  },
};

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav style={S.nav}>
      <Link to="/" style={S.logo}>TrustHire</Link>

      <div style={S.links}>
        <Link to="/"        style={{ ...S.link, ...(isActive('/')        ? S.linkActive : {}) }}>Check</Link>
        <Link to="/reports" style={{ ...S.link, ...(isActive('/reports') ? S.linkActive : {}) }}>Community</Link>
        {user && (
          <Link to="/report/new" style={{ ...S.link, ...(isActive('/report/new') ? S.linkActive : {}) }}>Report a Scam</Link>
        )}
      </div>

      <div style={S.user}>
        {user ? (
          <>
            <span>Hi, <strong style={{ color: 'var(--text)' }}>{user.username}</strong></span>
            <button style={S.logoutBtn} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={{ ...S.btn, ...S.loginBtn }}    onClick={() => navigate('/login')}>Login</button>
            <button style={{ ...S.btn, ...S.registerBtn }} onClick={() => navigate('/register')}>Sign up</button>
          </div>
        )}
      </div>
    </nav>
  );
}