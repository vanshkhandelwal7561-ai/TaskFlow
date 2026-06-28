import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await registerApi(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome, ${res.data.user.name.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.brand}>
            <div style={styles.logoBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
            </div>
            <span style={styles.brandName}>TaskFlow</span>
          </div>
          <div style={styles.leftContent}>
            <h1 style={styles.leftHeading}>
              Your team's<br />
              <span style={styles.gradient}>command center.</span>
            </h1>
            <p style={styles.leftSub}>
              Set up in minutes. Invite your team. Start shipping. TaskFlow keeps everyone aligned without the noise.
            </p>
            <div style={styles.features}>
              {['Free forever, no credit card', 'AI-powered task estimates', 'Beautiful Kanban boards'].map(f => (
                <div key={f} style={styles.featureRow}>
                  <div style={styles.featureDot}/>
                  <span style={styles.featureText}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={styles.leftFooter}>© 2026 TaskFlow · Built for teams</p>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Create account</h2>
            <p style={styles.cardSub}>Free forever. No credit card required.</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <input style={styles.input} value={form.name} onChange={set('name')} placeholder="Jane Smith" required autoFocus
                onFocus={e => e.target.style.borderColor='#4F6EF7'} onBlur={e => e.target.style.borderColor='#E2E4F0'} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input style={styles.input} type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" required
                onFocus={e => e.target.style.borderColor='#4F6EF7'} onBlur={e => e.target.style.borderColor='#E2E4F0'} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" required
                onFocus={e => e.target.style.borderColor='#4F6EF7'} onBlur={e => e.target.style.borderColor='#E2E4F0'} />
            </div>
            <button type="submit" style={{...styles.submitBtn, opacity: loading ? 0.7 : 1}} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display:'flex', minHeight:'100vh', fontFamily:"'DM Sans', -apple-system, sans-serif" },
  left: { flex:1, display:'flex', background:'linear-gradient(145deg, #07080F 0%, #0D1021 40%, #111530 100%)', padding:'40px', position:'relative', overflow:'hidden' },
  leftInner: { display:'flex', flexDirection:'column', justifyContent:'space-between', width:'100%', position:'relative', zIndex:1 },
  brand: { display:'flex', alignItems:'center', gap:10 },
  logoBox: { width:36, height:36, borderRadius:8, background:'linear-gradient(135deg, #4F6EF7, #C084FC)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(79,110,247,0.4)' },
  brandName: { fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:'1.1rem', color:'white', letterSpacing:'-0.02em' },
  leftContent: { flex:1, display:'flex', flexDirection:'column', justifyContent:'center', paddingBottom:40 },
  leftHeading: { fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:'2.4rem', color:'white', lineHeight:1.15, letterSpacing:'-0.04em', marginBottom:18 },
  gradient: { background:'linear-gradient(135deg, #818CF8, #C084FC)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  leftSub: { color:'rgba(255,255,255,0.45)', fontSize:'0.95rem', lineHeight:1.7, marginBottom:32, maxWidth:340 },
  features: { display:'flex', flexDirection:'column', gap:12 },
  featureRow: { display:'flex', alignItems:'center', gap:10 },
  featureDot: { width:6, height:6, borderRadius:'50%', background:'#4F6EF7', flexShrink:0 },
  featureText: { color:'rgba(255,255,255,0.6)', fontSize:'0.88rem' },
  leftFooter: { color:'rgba(255,255,255,0.2)', fontSize:'0.78rem' },
  right: { width:'480px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 24px', background:'#F6F7FB' },
  card: { width:'100%', maxWidth:'380px', background:'white', borderRadius:20, padding:'40px 36px', boxShadow:'0 8px 40px rgba(11,13,26,0.1), 0 2px 8px rgba(11,13,26,0.06)', border:'1px solid #E8EAF2' },
  cardHeader: { marginBottom:28 },
  cardTitle: { fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:'1.65rem', color:'#0B0D1A', letterSpacing:'-0.03em', marginBottom:6 },
  cardSub: { color:'#6B7280', fontSize:'0.9rem' },
  errorBox: { display:'flex', alignItems:'center', gap:8, background:'#FEF2F2', border:'1px solid rgba(239,68,68,0.2)', color:'#EF4444', borderRadius:8, padding:'10px 12px', fontSize:'0.84rem', marginBottom:18, fontWeight:500 },
  form: { display:'flex', flexDirection:'column', gap:16 },
  field: { display:'flex', flexDirection:'column', gap:6 },
  label: { fontSize:'0.74rem', fontWeight:700, color:'#525775', textTransform:'uppercase', letterSpacing:'0.06em' },
  input: { padding:'10px 13px', border:'1.5px solid #E2E4F0', borderRadius:8, fontSize:'0.875rem', color:'#0B0D1A', background:'#F8F9FC', outline:'none', transition:'border-color 0.15s', fontFamily:"'DM Sans', sans-serif" },
  submitBtn: { marginTop:4, padding:'11px 18px', background:'linear-gradient(135deg, #4F6EF7, #3A57E8)', color:'white', border:'none', borderRadius:8, fontSize:'0.9rem', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(79,110,247,0.35)', fontFamily:"'DM Sans', sans-serif", letterSpacing:'-0.01em' },
  switchText: { textAlign:'center', marginTop:22, fontSize:'0.875rem', color:'#6B7280' },
  link: { color:'#4F6EF7', fontWeight:600, textDecoration:'none' },
};