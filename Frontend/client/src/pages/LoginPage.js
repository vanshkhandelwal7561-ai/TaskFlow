import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api';
import toast from 'react-hot-toast';

// Inject Google Fonts — Inter replaces Syne to fix character clipping at bold weights
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap';
if (!document.head.querySelector('link[href*="Inter"]')) {
  document.head.appendChild(fontLink);
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>

      {/* Left Panel */}
      <div style={styles.left}>
        <div style={styles.leftInner}>

          <div style={styles.brand}>
            <div style={styles.logoBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
            </div>
            <span style={styles.brandName}>TaskFlow</span>
          </div>

          <div style={styles.leftContent}>
            <h1 style={styles.leftHeading}>
              The smarter way to<br />
              <span style={styles.gradientText}>manage your work.</span>
            </h1>
            <p style={styles.leftSub}>
              Boards, tasks, priorities and AI-powered estimates — everything your team needs to ship faster.
            </p>
            <div style={styles.features}>
              {[
                'AI-powered effort estimates',
                'Real-time Kanban boards',
                'Priority & due date tracking',
              ].map(f => (
                <div key={f} style={styles.featureRow}>
                  <div style={styles.featureDot} />
                  <span style={styles.featureText}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={styles.leftFooter}>© 2026 TaskFlow · Built for teams</p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.right}>
        <div style={styles.card}>

          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Sign in</h2>
            <p style={styles.cardSub}>Enter your credentials to continue</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                style={styles.input}
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@company.com"
                required
                autoFocus
                onFocus={e => e.target.style.borderColor = '#4F6EF7'}
                onBlur={e => e.target.style.borderColor = '#D1D5E8'}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                required
                onFocus={e => e.target.style.borderColor = '#4F6EF7'}
                onBlur={e => e.target.style.borderColor = '#D1D5E8'}
              />
            </div>
            <button
              type="submit"
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    flexWrap: 'wrap',
  },
  left: {
    flex: 1,
    minWidth: 300,
    display: 'flex',
    background: 'linear-gradient(145deg, #07080F 0%, #0D1021 40%, #111530 100%)',
    padding: '40px',
    position: 'relative',
    overflow: 'hidden',
  },
  leftInner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #4F6EF7, #C084FC)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(79,110,247,0.4)',
    flexShrink: 0,
  },
  brandName: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 800,
    fontSize: '1.1rem',
    color: 'white',
    letterSpacing: '-0.02em',
    lineHeight: 1.4,
  },
  leftContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  leftHeading: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 800,
    fontSize: '2.2rem',
    color: 'white',
    lineHeight: 1.3,
    letterSpacing: '-0.03em',
    marginBottom: 18,
    overflow: 'visible',
  },
  gradientText: {
    background: 'linear-gradient(135deg, #818CF8, #C084FC)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'inline-block',
    paddingBottom: 3,
  },
  leftSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.92rem',
    lineHeight: 1.7,
    marginBottom: 32,
    maxWidth: 340,
    fontFamily: "'DM Sans', sans-serif",
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  featureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#4F6EF7',
    flexShrink: 0,
  },
  featureText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: '0.88rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  leftFooter: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: '0.78rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  right: {
    width: '100%',
    maxWidth: 480,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    background: '#ECEEF6',
    minHeight: '100vh',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    background: '#FFFFFF',
    borderRadius: 20,
    padding: '40px 36px',
    boxShadow: '0 8px 40px rgba(11,13,26,0.13), 0 2px 8px rgba(11,13,26,0.08)',
    border: '1px solid #D8DCEE',
    overflow: 'visible',
  },
  cardHeader: {
    marginBottom: 28,
    overflow: 'visible',
  },
  cardTitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 800,
    fontSize: '1.8rem',
    color: '#0A0C1B',
    letterSpacing: '-0.03em',
    marginBottom: 8,
    lineHeight: 1.3,
    paddingBottom: 2,
    overflow: 'visible',
    display: 'block',
  },
  cardSub: {
    color: '#4B5168',
    fontSize: '0.92rem',
    fontWeight: 400,
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.5,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#FEF2F2',
    border: '1px solid rgba(239,68,68,0.2)',
    color: '#EF4444',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: '0.84rem',
    marginBottom: 18,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: '0.74rem',
    fontWeight: 700,
    color: '#3A3F5C',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.4,
  },
  input: {
    padding: '10px 13px',
    border: '1.5px solid #D1D5E8',
    borderRadius: 8,
    fontSize: '0.9rem',
    color: '#0A0C1B',
    background: '#F4F6FC',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: "'DM Sans', sans-serif",
    width: '100%',
    boxSizing: 'border-box',
    lineHeight: 1.5,
  },
  submitBtn: {
    marginTop: 4,
    padding: '12px 18px',
    background: 'linear-gradient(135deg, #4F6EF7, #3A57E8)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.93rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(79,110,247,0.35)',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '-0.01em',
    transition: 'all 0.15s',
    width: '100%',
    lineHeight: 1.5,
  },
  switchText: {
    textAlign: 'center',
    marginTop: 22,
    fontSize: '0.875rem',
    color: '#4B5168',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.5,
  },
  link: {
    color: '#3A57E8',
    fontWeight: 700,
    textDecoration: 'none',
  },
};
