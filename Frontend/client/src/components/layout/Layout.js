import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isHome = location.pathname === '/';
  const isPrefs = location.pathname === '/preferences';

  // ── Dynamic theme tokens ──
  const t = dark ? {
    shell:        '#0F1117',
    sidebar:      '#161821',
    sidebarBrd:   '#2A2D3E',
    topbar:       '#161821',
    topbarBrd:    '#2A2D3E',
    navActive:    '#1E2240',
    navActiveClr: '#818CF8',
    navHover:     '#1A1D2E',
    navClr:       '#9598B8',
    section:      '#3A3D55',
    brand:        '#E8EAF6',
    divider:      '#2A2D3E',
    userCard:     '#1A1D2E',
    userCardBrd:  '#2A2D3E',
    userName:     '#E8EAF6',
    userEmail:    '#6B6E8A',
    logoutClr:    '#6B6E8A',
    dateBadge:    '#1A1D2E',
    dateBadgeBrd: '#2A2D3E',
    dateBadgeClr: '#9598B8',
    breadCurr:    '#E8EAF6',
    breadLink:    '#6B6E8A',
    themeBtn:     '#9598B8',
    themeBtnHov:  '#1A1D2E',
    content:      '#0F1117',
  } : {
    shell:        '#F6F7FB',
    sidebar:      '#FFFFFF',
    sidebarBrd:   '#E8EAF2',
    topbar:       '#FFFFFF',
    topbarBrd:    '#E8EAF2',
    navActive:    '#EEF1FE',
    navActiveClr: '#4F6EF7',
    navHover:     '#F4F5FA',
    navClr:       '#525775',
    section:      '#C4C8DF',
    brand:        '#0B0D1A',
    divider:      '#F0F1F9',
    userCard:     '#F6F7FB',
    userCardBrd:  '#EDEEF5',
    userName:     '#0B0D1A',
    userEmail:    '#9598B8',
    logoutClr:    '#9598B8',
    dateBadge:    '#F6F7FB',
    dateBadgeBrd: '#EDEEF5',
    dateBadgeClr: '#9598B8',
    breadCurr:    '#0B0D1A',
    breadLink:    '#9598B8',
    themeBtn:     '#525775',
    themeBtnHov:  '#F4F5FA',
    content:      '#F6F7FB',
  };

  const navItemStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: 9,
    padding: '9px 10px', borderRadius: 8,
    fontSize: '0.875rem',
    color: active ? t.navActiveClr : t.navClr,
    background: active ? t.navActive : 'transparent',
    fontWeight: active ? 600 : 500,
    transition: 'all 0.15s', cursor: 'pointer',
    textDecoration: 'none',
  });

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'DM Sans', -apple-system, sans-serif", background: t.content }}>

      {mobileOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:99 }}
          onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: t.sidebar,
        borderRight: `1px solid ${t.sidebarBrd}`,
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transition: 'background 0.2s, border-color 0.2s',
      }}>

        {/* Brand */}
        <div style={{ padding:'18px 16px 16px', borderBottom:`1px solid ${t.divider}` }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none' }}
            onClick={() => setMobileOpen(false)}>
            <div style={{
              width:32, height:32, borderRadius:8, flexShrink:0,
              background:'linear-gradient(135deg, #4F6EF7, #C084FC)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 3px 10px rgba(79,110,247,0.3)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
            </div>
            <span style={{
              fontFamily:"'Inter', sans-serif", fontWeight:800,
              fontSize:'1.05rem', letterSpacing:'-0.02em', color: t.brand,
            }}>TaskFlow</span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
          <p style={{ fontSize:'0.67rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color: t.section, padding:'4px 10px 6px' }}>
            Workspace
          </p>

          <Link to="/" style={navItemStyle(isHome)} onClick={() => setMobileOpen(false)}
            onMouseEnter={e => { if (!isHome) e.currentTarget.style.background = t.navHover; }}
            onMouseLeave={e => { if (!isHome) e.currentTarget.style.background = 'transparent'; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </Link>

          <p style={{ fontSize:'0.67rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color: t.section, padding:'4px 10px 6px', marginTop:20 }}>
            Settings
          </p>

          {/* ✅ Fixed: now a real Link */}
          <Link to="/preferences" style={navItemStyle(isPrefs)} onClick={() => setMobileOpen(false)}
            onMouseEnter={e => { if (!isPrefs) e.currentTarget.style.background = t.navHover; }}
            onMouseLeave={e => { if (!isPrefs) e.currentTarget.style.background = 'transparent'; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
            Preferences
          </Link>
        </nav>

        {/* Bottom */}
        <div style={{ padding:'12px 10px 16px', borderTop:`1px solid ${t.divider}` }}>
          {/* Theme toggle */}
          <button
            style={{
              display:'flex', alignItems:'center', gap:9,
              width:'100%', padding:'8px 10px', borderRadius:8,
              border:'none', background:'transparent',
              fontSize:'0.855rem', fontWeight:500, color: t.themeBtn,
              cursor:'pointer', transition:'background 0.15s',
              fontFamily:"'DM Sans', sans-serif", marginBottom:8,
            }}
            onClick={toggle}
            onMouseEnter={e => e.currentTarget.style.background = t.themeBtnHov}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            {dark ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
                Light Mode
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
                Dark Mode
              </>
            )}
          </button>

          <div style={{ height:1, background: t.divider, margin:'4px 0 12px' }} />

          {/* User card */}
          <div style={{
            display:'flex', alignItems:'center', gap:9,
            padding:'10px', borderRadius:10,
            background: t.userCard, border:`1px solid ${t.userCardBrd}`,
          }}>
            <div style={{
              width:30, height:30, borderRadius:'50%', flexShrink:0,
              background:'linear-gradient(135deg, #4F6EF7, #C084FC)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'white', fontSize:'0.68rem', fontWeight:800,
            }}>{initials}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'0.82rem', fontWeight:600, color: t.userName, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize:'0.7rem', color: t.userEmail, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {user?.email}
              </div>
            </div>
            <button
              style={{ width:28, height:28, border:'none', borderRadius:6, background:'transparent', color: t.logoutClr, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.15s', flexShrink:0 }}
              onClick={handleLogout} title="Logout"
              onMouseEnter={e => { e.currentTarget.style.background='#FEF2F2'; e.currentTarget.style.color='#EF4444'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color= t.logoutClr; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex:1, marginLeft:220, display:'flex', flexDirection:'column', minHeight:'100vh' }}>

        {/* Topbar */}
        <header style={{
          height:56, background: t.topbar,
          borderBottom:`1px solid ${t.topbarBrd}`,
          display:'flex', alignItems:'center',
          padding:'0 24px', gap:12,
          position:'sticky', top:0, zIndex:50,
          boxShadow:'0 1px 3px rgba(11,13,26,0.05)',
          transition:'background 0.2s, border-color 0.2s',
        }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {!isHome && !isPrefs && (
                <>
                  <Link to="/" style={{ fontSize:'0.82rem', color: t.breadLink, textDecoration:'none', fontWeight:500 }}>
                    Dashboard
                  </Link>
                  <span style={{ color: t.section, fontSize:'0.82rem' }}>/</span>
                </>
              )}
              <span style={{ fontSize:'0.82rem', color: t.breadCurr, fontWeight:600 }}>
                {isHome ? 'Dashboard' : isPrefs ? 'Preferences' : 'Board'}
              </span>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              fontSize:'0.78rem', color: t.dateBadgeClr, fontWeight:500,
              padding:'4px 10px', background: t.dateBadge,
              border:`1px solid ${t.dateBadgeBrd}`, borderRadius:6,
            }}>
              {new Date().toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
            </div>
            <div style={{
              width:28, height:28, borderRadius:'50%',
              background:'linear-gradient(135deg, #4F6EF7, #C084FC)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'white', fontSize:'0.65rem', fontWeight:800,
            }}>{initials}</div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, padding:'32px 28px', maxWidth:1280, width:'100%', background: t.content, transition:'background 0.2s' }}>
          <Outlet context={{ dark, t }} />
        </main>
      </div>
    </div>
  );
}
