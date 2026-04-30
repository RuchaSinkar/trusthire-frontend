import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReports, upvoteReport } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const S = {
  page:  { minHeight: '100vh', paddingTop: '60px', maxWidth: 760, margin: '0 auto', padding: '80px 1.5rem 5rem' },
  header: { marginBottom: '2.5rem' },
  title: { fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub:   { color: 'var(--muted)', fontSize: '0.95rem' },
  toolbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap',
  },
  sortBtns: { display: 'flex', gap: '8px' },
  sortBtn:  {
    padding: '7px 16px', borderRadius: '8px', fontSize: '0.825rem',
    fontWeight: 500, cursor: 'pointer', transition: 'all .2s',
    background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--muted)',
  },
  sortActive: {
    background: 'rgba(108,99,255,0.15)',
    border: '1px solid rgba(108,99,255,0.4)', color: 'var(--accent2)',
  },
  reportBtn: {
    padding: '8px 18px', borderRadius: '8px', fontSize: '0.825rem',
    fontWeight: 600, cursor: 'pointer',
    background: 'var(--accent)', border: 'none', color: '#fff',
    transition: 'opacity .2s',
  },
  card: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '1.5rem',
    marginBottom: '1rem', transition: 'border-color .2s',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' },
  company: { fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' },
  domain:  { fontSize: '0.8rem', color: 'var(--accent2)' },
  desc:    { fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, margin: '1rem 0' },
  meta:    { display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--muted)' },
  upvote: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '6px 14px', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'transparent',
    color: 'var(--muted)', fontSize: '0.825rem', cursor: 'pointer',
    transition: 'all .2s', fontFamily: 'var(--font-body)',
  },
  upvoted: { borderColor: 'rgba(108,99,255,0.4)', color: 'var(--accent2)', background: 'rgba(108,99,255,0.1)' },
  stipend: {
    display: 'inline-block', padding: '3px 10px',
    background: 'var(--amber-bg)', border: '1px solid rgba(245,158,11,0.3)',
    borderRadius: '6px', fontSize: '0.75rem', color: 'var(--amber)',
  },
  empty: { textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' },
  spinner: {
    width: 28, height: 28, border: '2px solid var(--border)',
    borderTopColor: 'var(--accent)', borderRadius: '50%',
    animation: 'spin 0.7s linear infinite', margin: '4rem auto',
  },
};

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [sort, setSort]       = useState('recent');
  const [page, setPage]       = useState(0);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const { user }              = useAuth();

  useEffect(() => {
    setLoading(true);
    getReports(page, sort)
      .then(res => {
        setReports(res.data.content);
        setTotal(res.data.totalElements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sort, page]);

  const handleUpvote = async (id) => {
    if (!user) { alert('Please login to upvote'); return; }
    try {
      await upvoteReport(id);
      setReports(reports.map(r =>
        r.id === id
          ? { ...r, upvotes: r.upvotedByCurrentUser ? r.upvotes - 1 : r.upvotes + 1, upvotedByCurrentUser: !r.upvotedByCurrentUser }
          : r
      ));
    } catch {}
  };

  return (
    <div style={S.page}>
      <div style={S.header} className="fade-up">
        <h1 style={S.title}>Community reports</h1>
        <p style={S.sub}>Real experiences from job seekers. Help others by sharing yours.</p>
      </div>

      <div style={S.toolbar}>
        <div style={S.sortBtns}>
          {['recent','popular'].map(s => (
            <button key={s} style={{ ...S.sortBtn, ...(sort===s ? S.sortActive : {}) }}
              onClick={() => { setSort(s); setPage(0); }}>
              {s === 'recent' ? 'Most recent' : 'Most upvoted'}
            </button>
          ))}
        </div>
        {user ? (
          <Link to="/report/new">
            <button style={S.reportBtn}>+ Report a scam</button>
          </Link>
        ) : (
          <Link to="/login" style={{ fontSize: '0.825rem', color: 'var(--muted)' }}>
            Login to report
          </Link>
        )}
      </div>

      {loading ? (
        <div style={S.spinner}/>
      ) : reports.length === 0 ? (
        <div style={S.empty}>
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No reports yet</p>
          <p style={{ fontSize: '0.875rem' }}>Be the first to report a scam company</p>
        </div>
      ) : (
        <>
          {reports.map((r, i) => (
            <div key={r.id} style={{ ...S.card, animationDelay: `${i*0.05}s` }}
              className="fade-up"
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--border2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
            >
              <div style={S.cardTop}>
                <div>
                  <div style={S.company}>{r.companyName}</div>
                  {r.domain && <div style={S.domain}>{r.domain}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  {r.stipendOffered && <span style={S.stipend}>₹{r.stipendOffered}</span>}
                  <button
                    style={{ ...S.upvote, ...(r.upvotedByCurrentUser ? S.upvoted : {}) }}
                    onClick={() => handleUpvote(r.id)}
                  >
                    ▲ {r.upvotes}
                  </button>
                </div>
              </div>

              <p style={S.desc}>{r.description.length > 220 ? r.description.slice(0, 220) + '…' : r.description}</p>

              <div style={S.meta}>
                <span>Reported by {r.reportedBy}</span>
                <span>·</span>
                <span>{new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                {r.verified && (
                  <>
                    <span>·</span>
                    <span style={{ color: 'var(--green)' }}>✓ Verified</span>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            {page > 0 && (
              <button style={S.sortBtn} onClick={() => setPage(p => p-1)}>← Previous</button>
            )}
            <span style={{ fontSize: '0.825rem', color: 'var(--muted)', alignSelf: 'center' }}>
              Showing {page*10+1}–{Math.min((page+1)*10, total)} of {total}
            </span>
            {(page+1)*10 < total && (
              <button style={S.sortBtn} onClick={() => setPage(p => p+1)}>Next →</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}