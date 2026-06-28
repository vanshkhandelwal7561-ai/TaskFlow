import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getBoards, deleteBoard, getTasksByBoard } from '../api';
import BoardModal from '../components/ui/BoardModal';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  // Get dark mode context from Layout
  const outletCtx = useOutletContext?.() || {};
  const dark = outletCtx.dark || false;

  const fetchBoards = useCallback(async () => {
    try { const r = await getBoards(); setBoards(r.data.data); }
    catch { toast.error('Failed to load boards.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBoards(); }, [fetchBoards]);

  const totalTasks = boards.reduce((s, b) => s + (b.taskCount || 0), 0);
  const [inProgressCount, setInProgressCount] = useState(0);

  // Fetch all tasks across boards to count in-progress ones
  useEffect(() => {
    if (boards.length === 0) { setInProgressCount(0); return; }
    Promise.all(boards.map(b => getTasksByBoard(b._id, {}).catch(() => ({ data: { data: [] } }))))
      .then(results => {
        const count = results.reduce((sum, r) => {
          const tasks = r?.data?.data || [];
          return sum + tasks.filter(t => t.status === 'in-progress').length;
        }, 0);
        setInProgressCount(count);
      });
  }, [boards]);

  const handleSaved = (saved) => setBoards(prev => {
    const exists = prev.find(b => b._id === saved._id);
    return exists
      ? prev.map(b => b._id === saved._id ? { ...saved, taskCount: b.taskCount } : b)
      : [saved, ...prev];
  });

  const handleDelete = async (e, board) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${board.title}" and all its tasks?`)) return;
    try {
      await deleteBoard(board._id);
      setBoards(p => p.filter(b => b._id !== board._id));
      toast.success('Board deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const close = () => { setShowModal(false); setEditing(null); };

  const colors = ['#4F6EF7', '#C084FC', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4'];

  // ── Dynamic theme tokens ──
  const cardBg    = dark ? '#161821' : '#FFFFFF';
  const cardBrd   = dark ? '#2A2D3E' : '#E8EAF2';
  const heading   = dark ? '#E8EAF6' : '#0B0D1A';
  const subClr    = dark ? '#6B6E8A' : '#6B7280';
  const eyeClr    = dark ? '#3A3D55' : '#9598B8';
  const statLbl   = dark ? '#6B6E8A' : '#9598B8';
  const cardDesc  = dark ? '#6B6E8A' : '#6B7280';
  const cardTitle = dark ? '#E8EAF6' : '#0B0D1A';
  const footerBrd = dark ? '#2A2D3E' : '#F0F1F9';
  const taskClr   = dark ? '#6B6E8A' : '#9598B8';
  const menuClr   = dark ? '#6B6E8A' : '#9598B8';
  const addBrd    = dark ? '#2A2D3E' : '#E2E4F0';
  const addBg     = dark ? '#161821' : '#FAFBFF';
  const addLbl    = dark ? '#4A4D6A' : '#9598B8';
  const skelBg    = dark ? 'linear-gradient(90deg,#1E2035 0%,#252840 50%,#1E2035 100%)' : 'linear-gradient(90deg,#F0F1F9 0%,#E8EAF2 50%,#F0F1F9 100%)';
  const emptyBrd  = dark ? '#2A2D3E' : '#E2E4F0';
  const emptyBg   = dark ? '#161821' : '#FFFFFF';

  return (
    <div style={{ fontFamily:"'DM Sans', -apple-system, sans-serif", maxWidth:1200, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, gap:16, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontFamily:"'Inter', sans-serif", fontSize:'1.65rem', fontWeight:800, color: heading, letterSpacing:'-0.03em', marginBottom:4, lineHeight:1.3 }}>
            My Workspace
          </h1>
          <p style={{ color: subClr, fontSize:'0.88rem' }}>
            Manage your projects and track progress across all boards.
          </p>
        </div>
        <button
          style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 20px', background:'linear-gradient(135deg, #4F6EF7, #3A57E8)', color:'white', border:'none', borderRadius:9, fontSize:'0.875rem', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(79,110,247,0.3)', transition:'all 0.15s', fontFamily:"'DM Sans', sans-serif", whiteSpace:'nowrap' }}
          onClick={() => setShowModal(true)}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform='none'}>
          + New Board
        </button>
      </div>

      {/* Stats */}
      {!loading && boards.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:32 }}>
          {[
            { label:'Total Boards', value: boards.length,    color:'#4F6EF7', bg: dark ? '#1A1E3A' : '#EEF1FE' },
            { label:'Total Tasks',  value: totalTasks,       color:'#C084FC', bg: dark ? '#241A3A' : '#F5EEFF' },
            { label:'In Progress',  value: inProgressCount,  color:'#22C55E', bg: dark ? '#162A1E' : '#ECFDF5' },
          ].map(s => (
            <div key={s.label} style={{ background: cardBg, border:`1px solid ${cardBrd}`, borderRadius:12, padding:'18px 20px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 2px 8px rgba(11,13,26,0.05)', transition:'background 0.2s' }}>
              <div style={{ width:42, height:42, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: s.bg, color: s.color }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily:"'Inter', sans-serif", fontSize:'1.6rem', fontWeight:800, letterSpacing:'-0.04em', lineHeight:1, color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontSize:'0.78rem', color: statLbl, fontWeight:500, marginTop:3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section label */}
      <p style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color: eyeClr, marginBottom:14 }}>
        Boards
      </p>

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(268px,1fr))', gap:16 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: cardBg, border:`1px solid ${cardBrd}`, borderRadius:14, padding:20 }}>
              {[['40%',14,16],['70%',18,8],['90%',14,6],['60%',14,0]].map(([w,h,mb], j) => (
                <div key={j} style={{ background: skelBg, backgroundSize:'300% 100%', animation:'shimmer 1.5s ease infinite', borderRadius:6, width:w, height:h, marginBottom:mb }} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && boards.length === 0 && (
        <div style={{ textAlign:'center', padding:'72px 24px', border:`2px dashed ${emptyBrd}`, borderRadius:16, background: emptyBg }}>
          <div style={{ width:60, height:60, borderRadius:14, background: dark ? '#1A1E3A' : '#EEF1FE', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4F6EF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </div>
          <h3 style={{ fontFamily:"'Inter', sans-serif", fontSize:'1.1rem', fontWeight:700, color: heading, marginBottom:8 }}>No boards yet</h3>
          <p style={{ color: subClr, fontSize:'0.875rem', marginBottom:22, maxWidth:280, margin:'0 auto 22px' }}>
            Create your first board to start organising tasks and tracking your team's progress.
          </p>
          <button
            style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 20px', background:'linear-gradient(135deg, #4F6EF7, #3A57E8)', color:'white', border:'none', borderRadius:9, fontSize:'0.875rem', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(79,110,247,0.3)', fontFamily:"'DM Sans', sans-serif" }}
            onClick={() => setShowModal(true)}>
            + Create your first board
          </button>
        </div>
      )}

      {/* Boards Grid */}
      {!loading && boards.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(268px,1fr))', gap:16 }}>
          {boards.map((board, i) => {
            const color = colors[i % colors.length];
            return (
              <div key={board._id}
                style={{ background: cardBg, border:`1.5px solid ${cardBrd}`, borderRadius:14, padding:'20px', cursor:'pointer', transition:'all 0.18s', boxShadow:'0 2px 8px rgba(11,13,26,0.06)', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column' }}
                onClick={() => navigate(`/board/${board._id}`)}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(11,13,26,0.12)'; e.currentTarget.style.borderColor=color; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 8px rgba(11,13,26,0.06)'; e.currentTarget.style.borderColor=cardBrd; }}
              >
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${color}, ${color}88)` }} />

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                  <div style={{ width:38, height:38, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', background:`${color}18`, color }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                    </svg>
                  </div>
                  <div style={{ display:'flex', gap:2 }} onClick={e => e.stopPropagation()}>
                    <button
                      style={{ width:28, height:28, border:'none', borderRadius:6, background:'transparent', color: menuClr, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}
                      title="Edit"
                      onClick={() => { setEditing(board); setShowModal(true); }}
                      onMouseEnter={e => e.currentTarget.style.background = dark ? '#2A2D3E' : '#F0F1F9'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      style={{ width:28, height:28, border:'none', borderRadius:6, background:'transparent', color: menuClr, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}
                      title="Delete"
                      onClick={e => handleDelete(e, board)}
                      onMouseEnter={e => { e.currentTarget.style.background='#FEF2F2'; e.currentTarget.style.color='#EF4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color= menuClr; }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <h3 style={{ fontFamily:"'Inter', sans-serif", fontSize:'0.98rem', fontWeight:700, color: cardTitle, letterSpacing:'-0.01em', marginBottom:6 }}>
                  {board.title}
                </h3>
                <p style={{ fontSize:'0.82rem', color: cardDesc, lineHeight:1.5, flex:1, marginBottom:16, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                  {board.description || 'No description added yet.'}
                </p>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:14, borderTop:`1px solid ${footerBrd}` }}>
                  <span style={{ display:'flex', alignItems:'center', fontSize:'0.78rem', color: taskClr, fontWeight:500 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:4}}>
                      <polyline points="9 11 12 14 22 4"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                    </svg>
                    {board.taskCount ?? 0} task{board.taskCount !== 1 ? 's' : ''}
                  </span>
                  <span style={{ fontSize:'0.78rem', fontWeight:700, color }}> Open →</span>
                </div>
              </div>
            );
          })}

          {/* Add new */}
          <div
            style={{ border:`2px dashed ${addBrd}`, borderRadius:14, padding:'20px', cursor:'pointer', transition:'all 0.18s', background: addBg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:160, gap:8 }}
            onClick={() => setShowModal(true)}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#4F6EF7'; e.currentTarget.style.background = dark ? '#1A1E3A' : '#EEF1FE'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=addBrd; e.currentTarget.style.background=addBg; }}>
            <div style={{ width:40, height:40, borderRadius:10, background: dark ? '#1A1E3A' : '#EEF1FE', color:'#4F6EF7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', fontWeight:300 }}>
              +
            </div>
            <p style={{ fontSize:'0.85rem', fontWeight:600, color: addLbl }}>New Board</p>
          </div>
        </div>
      )}

      {showModal && <BoardModal board={editing} onClose={close} onSaved={handleSaved} />}
    </div>
  );
}

