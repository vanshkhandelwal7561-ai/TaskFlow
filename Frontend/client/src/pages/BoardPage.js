import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBoard, getTasksByBoard, deleteTask, updateTask } from '../api';
import TaskModal from '../components/ui/TaskModal';
import toast from 'react-hot-toast';
import { format, isPast, parseISO } from 'date-fns';

const COLS = [
  { key: 'todo',        label: 'To Do',       color: '#94A3B8', bg: '#F8FAFC', dot: '#94A3B8' },
  { key: 'in-progress', label: 'In Progress',  color: '#F59E0B', bg: '#FFFBEB', dot: '#F59E0B' },
  { key: 'done',        label: 'Done',         color: '#22C55E', bg: '#F0FDF4', dot: '#22C55E' },
];

const PRIORITY = {
  low:    { label: 'Low',    color: '#15803d', bg: '#DCFCE7', dot: '#22C55E' },
  medium: { label: 'Medium', color: '#92400e', bg: '#FEF3C7', dot: '#F59E0B' },
  high:   { label: 'High',   color: '#991b1b', bg: '#FEE2E2', dot: '#EF4444' },
};

function TaskCard({ task, onEdit, onDelete, onMove }) {
  const [hovered, setHovered] = useState(false);
  const isOverdue = task.dueDate && task.status !== 'done' && isPast(parseISO(task.dueDate));
  const p = PRIORITY[task.priority] || PRIORITY.medium;

  return (
    <div
      style={{
        ...styles.taskCard,
        borderColor: hovered ? 'rgba(79,110,247,0.35)' : (isOverdue ? 'rgba(239,68,68,0.25)' : '#E8EAF2'),
        boxShadow: hovered ? '0 6px 20px rgba(11,13,26,0.1)' : '0 1px 3px rgba(11,13,26,0.06)',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left accent bar */}
      <div style={{
        ...styles.taskAccent,
        background: isOverdue ? '#EF4444' : (hovered ? 'linear-gradient(180deg, #4F6EF7, #C084FC)' : 'transparent'),
      }} />

      {/* Top row */}
      <div style={styles.taskTop}>
        <span style={{ ...styles.badge, background: p.bg, color: p.color }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.dot, flexShrink: 0, display: 'inline-block' }} />
          {p.label}
        </span>
        <div style={{ display: 'flex', gap: 2, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
          <button style={styles.taskBtn} onClick={() => onEdit(task)}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F1F9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button style={styles.taskBtn} onClick={() => onDelete(task)}
            onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9598B8'; }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <p style={styles.taskTitle}>{task.title}</p>
      {task.description && <p style={styles.taskDesc}>{task.description}</p>}

      {/* Meta */}
      {(task.dueDate || task.estimatedEffort) && (
        <div style={styles.taskMeta}>
          {task.dueDate && (
            <span style={{ ...styles.chip, color: isOverdue ? '#EF4444' : '#9598B8', fontWeight: isOverdue ? 600 : 500 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {format(parseISO(task.dueDate), 'MMM d')}
              {isOverdue && ' · Overdue'}
            </span>
          )}
          {task.estimatedEffort && (
            <span style={styles.chip}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {task.estimatedEffort}
            </span>
          )}
        </div>
      )}

      {/* Move buttons */}
      <div style={styles.moveBtns}>
        {task.status !== 'todo' && (
          <button style={styles.moveBtn}
            onClick={() => onMove(task, task.status === 'in-progress' ? 'todo' : 'in-progress')}
            onMouseEnter={e => { e.currentTarget.style.background = '#EEF1FE'; e.currentTarget.style.color = '#4F6EF7'; e.currentTarget.style.borderColor = 'rgba(79,110,247,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F8F9FC'; e.currentTarget.style.color = '#9598B8'; e.currentTarget.style.borderColor = '#E8EAF2'; }}>
            ← {task.status === 'done' ? 'In Progress' : 'To Do'}
          </button>
        )}
        {task.status !== 'done' && (
          <button style={styles.moveBtn}
            onClick={() => onMove(task, task.status === 'todo' ? 'in-progress' : 'done')}
            onMouseEnter={e => { e.currentTarget.style.background = '#EEF1FE'; e.currentTarget.style.color = '#4F6EF7'; e.currentTarget.style.borderColor = 'rgba(79,110,247,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F8F9FC'; e.currentTarget.style.color = '#9598B8'; e.currentTarget.style.borderColor = '#E8EAF2'; }}>
            {task.status === 'todo' ? 'In Progress' : 'Done'} →
          </button>
        )}
      </div>
    </div>
  );
}

export default function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ priority: '', sortBy: 'createdAt', order: 'desc' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [br, tr] = await Promise.all([getBoard(id), getTasksByBoard(id, filters)]);
      setBoard(br.data.data); setTasks(tr.data.data);
    } catch { toast.error('Failed to load board.'); }
    finally { setLoading(false); }
  }, [id, filters]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSaved = (saved) => setTasks(p => {
    const e = p.find(t => t._id === saved._id);
    return e ? p.map(t => t._id === saved._id ? saved : t) : [saved, ...p];
  });

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try { await deleteTask(task._id); setTasks(p => p.filter(t => t._id !== task._id)); toast.success('Deleted.'); }
    catch { toast.error('Failed to delete.'); }
  };

  const handleMove = async (task, status) => {
    try { const r = await updateTask(task._id, { status }); setTasks(p => p.map(t => t._id === task._id ? r.data.data : t)); }
    catch { toast.error('Failed to move task.'); }
  };

  const close = () => { setShowModal(false); setEditingTask(null); };
  const colTasks = k => tasks.filter(t => t.status === k);

  return (
    <div style={styles.page}>

      {/* Top bar */}
      <div style={styles.topBar}>
        <div>
          <Link to="/" style={styles.backLink}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:5}}>
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            All Boards
          </Link>
          <h1 style={styles.boardName}>{loading ? '…' : board?.title}</h1>
          {board?.description && <p style={styles.boardDesc}>{board.description}</p>}
        </div>
        <div style={styles.topActions}>
          <button
            style={{ ...styles.filterBtn, background: showFilters ? '#EEF1FE' : 'white', color: showFilters ? '#4F6EF7' : '#6B7280', borderColor: showFilters ? 'rgba(79,110,247,0.3)' : '#E2E4F0' }}
            onClick={() => setShowFilters(v => !v)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filter
          </button>
          <button style={styles.addBtn} onClick={() => setShowModal(true)}>
            + Add Task
          </button>
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div style={styles.filterBar}>
          <span style={styles.filterLbl}>Filter by</span>
          {[
            { label: 'Priority', key: 'priority', opts: [['', 'All'], ['low','Low'], ['medium','Medium'], ['high','High']] },
            { label: 'Sort', key: 'sortBy', opts: [['createdAt','Date Created'], ['dueDate','Due Date'], ['priority','Priority']] },
            { label: 'Order', key: 'order', opts: [['desc','Newest'], ['asc','Oldest']] },
          ].map(f => (
            <select key={f.key} style={styles.filterSelect}
              value={filters[f.key]}
              onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))}>
              {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
          <button style={styles.resetBtn} onClick={() => setFilters({ priority: '', sortBy: 'createdAt', order: 'desc' })}>
            Reset
          </button>
        </div>
      )}

      {/* Kanban */}
      <div style={styles.kanban}>
        {COLS.map(col => (
          <div key={col.key} style={styles.column}>
            {/* Column header */}
            <div style={styles.colHeader}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: col.color, borderRadius: '12px 12px 0 0' }} />
              <div style={styles.colTitleRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: col.dot, display: 'inline-block' }} />
                  <span style={styles.colTitle}>{col.label}</span>
                </div>
                <span style={styles.colCount}>{colTasks(col.key).length}</span>
              </div>
            </div>

            {/* Tasks */}
            <div style={styles.colBody}>
              {loading
                ? [...Array(2)].map((_, i) => (
                    <div key={i} style={styles.skeletonTask}>
                      <div style={{ ...styles.skLine, width: '40%', height: 12, marginBottom: 12 }} />
                      <div style={{ ...styles.skLine, width: '80%', height: 16, marginBottom: 8 }} />
                      <div style={{ ...styles.skLine, width: '60%', height: 12 }} />
                    </div>
                  ))
                : colTasks(col.key).length === 0
                  ? <div style={styles.colEmpty}>No tasks here</div>
                  : colTasks(col.key).map(t => (
                      <TaskCard key={t._id} task={t}
                        onEdit={t => { setEditingTask(t); setShowModal(true); }}
                        onDelete={handleDelete}
                        onMove={handleMove}
                      />
                    ))
              }

              {/* Add task button */}
              <button style={styles.colAddBtn} onClick={() => setShowModal(true)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F6EF7'; e.currentTarget.style.color = '#4F6EF7'; e.currentTarget.style.background = '#EEF1FE'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E4F0'; e.currentTarget.style.color = '#9598B8'; e.currentTarget.style.background = 'transparent'; }}>
                + Add task
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <TaskModal boardId={id} task={editingTask} onClose={close} onSaved={handleSaved} />
      )}
    </div>
  );
}

const styles = {
  page: { fontFamily: "'DM Sans', -apple-system, sans-serif" },

  topBar: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' },
  backLink: { display: 'inline-flex', alignItems: 'center', fontSize: '0.78rem', color: '#9598B8', fontWeight: 500, textDecoration: 'none', marginBottom: 6 },
  boardName: { fontFamily: "'Syne', sans-serif", fontSize: '1.55rem', fontWeight: 800, color: '#0B0D1A', letterSpacing: '-0.03em' },
  boardDesc: { color: '#6B7280', fontSize: '0.86rem', marginTop: 3 },
  topActions: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  filterBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1.5px solid', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'DM Sans', sans-serif" },
  addBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'linear-gradient(135deg, #4F6EF7, #3A57E8)', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,110,247,0.3)', fontFamily: "'DM Sans', sans-serif" },

  filterBar: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'white', border: '1px solid #E8EAF2', borderRadius: 10, marginBottom: 22, flexWrap: 'wrap', boxShadow: '0 2px 8px rgba(11,13,26,0.05)' },
  filterLbl: { fontSize: '0.74rem', fontWeight: 700, color: '#9598B8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' },
  filterSelect: { padding: '7px 28px 7px 10px', border: '1.5px solid #E2E4F0', borderRadius: 7, fontSize: '0.82rem', color: '#0B0D1A', background: '#F8F9FC', cursor: 'pointer', outline: 'none', fontFamily: "'DM Sans', sans-serif", appearance: 'none' },
  resetBtn: { padding: '7px 12px', border: '1.5px solid #E2E4F0', borderRadius: 7, background: 'transparent', color: '#9598B8', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },

  kanban: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, alignItems: 'start' },

  column: { background: '#F6F7FB', border: '1px solid #E8EAF2', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 380 },
  colHeader: { padding: '16px 16px 14px', borderBottom: '1px solid #E8EAF2', position: 'relative', background: 'white' },
  colTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  colTitle: { fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#525775' },
  colCount: { fontFamily: "'Syne', sans-serif", fontSize: '0.72rem', fontWeight: 800, background: 'white', border: '1px solid #E8EAF2', color: '#9598B8', padding: '2px 8px', borderRadius: 99 },
  colBody: { flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 },
  colEmpty: { fontSize: '0.8rem', color: '#C4C8DF', textAlign: 'center', padding: '28px 0', border: '1.5px dashed #E8EAF2', borderRadius: 8 },
  colAddBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, width: '100%', padding: '8px', border: '1.5px dashed #E2E4F0', borderRadius: 8, background: 'transparent', color: '#9598B8', fontSize: '0.79rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', marginTop: 4, fontFamily: "'DM Sans', sans-serif" },

  taskCard: { background: 'white', border: '1.5px solid #E8EAF2', borderRadius: 10, padding: '13px 13px 11px 16px', transition: 'all 0.18s', position: 'relative', overflow: 'hidden' },
  taskAccent: { position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: '0 2px 2px 0', transition: 'background 0.2s' },
  taskTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.67rem', fontWeight: 700, padding: '3px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.05em' },
  taskBtn: { width: 24, height: 24, border: 'none', borderRadius: 5, background: 'transparent', color: '#9598B8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' },
  taskTitle: { fontSize: '0.875rem', fontWeight: 600, color: '#0B0D1A', letterSpacing: '-0.01em', lineHeight: 1.4, marginBottom: 4 },
  taskDesc: { fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 10 },
  taskMeta: { display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 9, borderTop: '1px solid #F0F1F9', marginBottom: 9 },
  chip: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.73rem', color: '#9598B8', fontWeight: 500 },
  moveBtns: { display: 'flex', gap: 6 },
  moveBtn: { flex: 1, fontSize: '0.7rem', fontWeight: 600, padding: '4px 8px', borderRadius: 5, border: '1px solid #E8EAF2', background: '#F8F9FC', color: '#9598B8', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" },

  skeletonTask: { background: 'white', border: '1px solid #E8EAF2', borderRadius: 10, padding: 14 },
  skLine: { background: 'linear-gradient(90deg, #F0F1F9 0%, #E8EAF2 50%, #F0F1F9 100%)', backgroundSize: '300% 100%', animation: 'shimmer 1.5s ease infinite', borderRadius: 5, display: 'block' },
};