import { useState, useEffect } from 'react';
import { createTask, updateTask, getAiSuggestion } from '../../api';
import toast from 'react-hot-toast';

const EMPTY = { title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', estimatedEffort: '' };

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{title}</h2>
          <button style={styles.closeBtn} onClick={onClose}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F1F9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div style={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

export default function TaskModal({ boardId, task, onClose, onSaved }) {
  const editing = !!task;
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [ai, setAi] = useState(null);

  useEffect(() => {
    if (task) setForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      estimatedEffort: task.estimatedEffort || '',
    });
  }, [task]);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleAi = async () => {
    if (!form.title.trim()) { toast.error('Add a title first.'); return; }
    setAiLoading(true);
    try {
      const res = await getAiSuggestion({ title: form.title, description: form.description });
      setAi({ ...res.data.data, fallback: res.data.fallback });
      if (!res.data.fallback) toast.success('AI estimate ready!');
      else toast('Using default estimate.', { icon: '⚠️' });
    } catch { toast.error('Could not reach AI.'); }
    finally { setAiLoading(false); }
  };

  const acceptAi = () => {
    setForm(f => ({
      ...f,
      estimatedEffort: `${ai.effort} (~${ai.hours}h)`,
      dueDate: ai.suggestedDueDate || f.dueDate,
    }));
    setAi(null);
    toast.success('Estimate applied!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, board: boardId, dueDate: form.dueDate || null };
      const res = editing
        ? await updateTask(task._id, payload)
        : await createTask(payload);
      toast.success(editing ? 'Task updated!' : 'Task created!');
      onSaved(res.data.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save.');
    } finally { setSaving(false); }
  };

  return (
    <Modal title={editing ? 'Edit Task' : 'New Task'} onClose={onClose}>
      <form onSubmit={handleSubmit}>

        {/* Title */}
        <div style={styles.field}>
          <label style={styles.label}>Title *</label>
          <input
            style={styles.input} value={form.title} onChange={set('title')}
            placeholder="What needs to be done?" autoFocus
            onFocus={e => e.target.style.borderColor = '#4F6EF7'}
            onBlur={e => e.target.style.borderColor = '#E2E4F0'}
          />
        </div>

        {/* Description */}
        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            style={{ ...styles.input, minHeight: 86, resize: 'vertical', lineHeight: 1.6 }}
            value={form.description} onChange={set('description')}
            placeholder="Add more context or details…"
            onFocus={e => e.target.style.borderColor = '#4F6EF7'}
            onBlur={e => e.target.style.borderColor = '#E2E4F0'}
          />
        </div>

        {/* Priority + Status */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Priority</label>
            <select style={styles.select} value={form.priority} onChange={set('priority')}
              onFocus={e => e.target.style.borderColor = '#4F6EF7'}
              onBlur={e => e.target.style.borderColor = '#E2E4F0'}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Status</label>
            <select style={styles.select} value={form.status} onChange={set('status')}
              onFocus={e => e.target.style.borderColor = '#4F6EF7'}
              onBlur={e => e.target.style.borderColor = '#E2E4F0'}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {/* Due Date + Effort */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Due Date</label>
            <input type="date" style={styles.input} value={form.dueDate} onChange={set('dueDate')}
              onFocus={e => e.target.style.borderColor = '#4F6EF7'}
              onBlur={e => e.target.style.borderColor = '#E2E4F0'} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Effort Estimate</label>
            <input style={styles.input} value={form.estimatedEffort} onChange={set('estimatedEffort')}
              placeholder="e.g. M (~4h)"
              onFocus={e => e.target.style.borderColor = '#4F6EF7'}
              onBlur={e => e.target.style.borderColor = '#E2E4F0'} />
          </div>
        </div>

        {/* AI Section */}
        <div style={styles.aiWrap}>
          <button type="button" style={styles.aiBtn} disabled={aiLoading} onClick={handleAi}
            onMouseEnter={e => !aiLoading && (e.currentTarget.style.borderColor = '#C084FC')}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(192,132,252,0.25)'}>
            {aiLoading ? (
              <>
                <div style={styles.aiSpinner} />
                Analysing task…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Suggest estimate with AI
              </>
            )}
          </button>

          {ai && (
            <div style={styles.aiCard}>
              <div style={styles.aiCardHeader}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                {ai.fallback ? 'Default Estimate' : 'AI Suggestion'}
              </div>

              <div style={styles.aiPills}>
                <div style={styles.aiPill}>
                  <span style={styles.aiPillLabel}>Effort</span>
                  <span style={styles.aiPillVal}>{ai.effort} · ~{ai.hours}h</span>
                </div>
                {ai.suggestedDueDate && (
                  <div style={styles.aiPill}>
                    <span style={styles.aiPillLabel}>Suggested Due</span>
                    <span style={styles.aiPillVal}>{ai.suggestedDueDate}</span>
                  </div>
                )}
              </div>

              <p style={styles.aiReason}>"{ai.reasoning}"</p>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" style={styles.acceptBtn} onClick={acceptAi}
                  onMouseEnter={e => e.currentTarget.style.background = '#3A57E8'}
                  onMouseLeave={e => e.currentTarget.style.background = '#4F6EF7'}>
                  Accept
                </button>
                <button type="button" style={styles.dismissBtn} onClick={() => setAi(null)}
                  onMouseEnter={e => e.currentTarget.style.background = '#F0F1F9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button type="button" style={styles.cancelBtn} onClick={onClose}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F1F9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            Cancel
          </button>
          <button type="submit" style={{ ...styles.submitBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
            {saving
              ? <><div style={{ ...styles.aiSpinner, borderTopColor: 'white' }} /> Saving…</>
              : editing ? 'Save Changes' : 'Create Task'
            }
          </button>
        </div>
      </form>
    </Modal>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(7,8,15,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 20,
    backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
    animation: 'fadeIn 0.15s ease',
  },
  modal: {
    background: 'white', borderRadius: 18,
    width: '100%', maxWidth: 520,
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 24px 64px rgba(11,13,26,0.18), 0 8px 24px rgba(11,13,26,0.1)',
    border: '1px solid #E8EAF2',
    animation: 'popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '22px 24px 0',
  },
  modalTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: '1.1rem',
    fontWeight: 800, color: '#0B0D1A', letterSpacing: '-0.02em',
  },
  closeBtn: {
    width: 32, height: 32, border: 'none', borderRadius: 7,
    background: 'transparent', color: '#9598B8', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s',
  },
  modalBody: { padding: '20px 24px 24px' },

  field: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 },
  label: { fontSize: '0.72rem', fontWeight: 700, color: '#525775', textTransform: 'uppercase', letterSpacing: '0.07em' },
  input: {
    width: '100%', padding: '10px 13px',
    border: '1.5px solid #E2E4F0', borderRadius: 8,
    fontSize: '0.875rem', color: '#0B0D1A',
    background: '#F8F9FC', outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
  select: {
    width: '100%', padding: '10px 13px',
    border: '1.5px solid #E2E4F0', borderRadius: 8,
    fontSize: '0.875rem', color: '#0B0D1A',
    background: '#F8F9FC', outline: 'none',
    cursor: 'pointer', appearance: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.15s',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },

  aiWrap: { margin: '6px 0 8px' },
  aiBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '9px 15px', borderRadius: 8, cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(192,132,252,0.08), rgba(79,110,247,0.08))',
    border: '1.5px solid rgba(192,132,252,0.25)', color: '#C084FC',
    fontSize: '0.83rem', fontWeight: 600,
    transition: 'border-color 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
  aiSpinner: {
    width: 13, height: 13, borderRadius: '50%',
    border: '2px solid rgba(192,132,252,0.3)',
    borderTopColor: '#C084FC',
    animation: 'spin 0.65s linear infinite',
    display: 'inline-block',
  },
  aiCard: {
    marginTop: 12,
    background: 'linear-gradient(135deg, rgba(192,132,252,0.06), rgba(79,110,247,0.06))',
    border: '1.5px solid rgba(192,132,252,0.18)',
    borderRadius: 10, padding: 16,
  },
  aiCardHeader: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: '0.7rem', fontWeight: 800,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: '#C084FC', marginBottom: 12,
  },
  aiPills: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
  aiPill: {
    background: 'white', border: '1px solid #E8EAF2',
    borderRadius: 8, padding: '8px 12px',
    display: 'flex', flexDirection: 'column', gap: 2, minWidth: 100,
  },
  aiPillLabel: { fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9598B8' },
  aiPillVal: { fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#0B0D1A' },
  aiReason: { fontSize: '0.8rem', color: '#6B7280', fontStyle: 'italic', lineHeight: 1.5, paddingTop: 10, borderTop: '1px solid rgba(192,132,252,0.12)', marginBottom: 12 },

  acceptBtn: {
    padding: '7px 16px', background: '#4F6EF7', color: 'white',
    border: 'none', borderRadius: 7, fontSize: '0.82rem', fontWeight: 700,
    cursor: 'pointer', transition: 'background 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
  dismissBtn: {
    padding: '7px 14px', background: 'transparent', color: '#9598B8',
    border: '1.5px solid #E2E4F0', borderRadius: 7,
    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
    transition: 'background 0.15s', fontFamily: "'DM Sans', sans-serif",
  },

  footer: {
    display: 'flex', justifyContent: 'flex-end', gap: 10,
    paddingTop: 20, marginTop: 16,
    borderTop: '1px solid #F0F1F9',
  },
  cancelBtn: {
    padding: '9px 18px', background: 'transparent', color: '#6B7280',
    border: '1.5px solid #E2E4F0', borderRadius: 8,
    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
    transition: 'background 0.15s', fontFamily: "'DM Sans', sans-serif",
  },
  submitBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '9px 22px',
    background: 'linear-gradient(135deg, #4F6EF7, #3A57E8)',
    color: 'white', border: 'none', borderRadius: 8,
    fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(79,110,247,0.3)',
    transition: 'opacity 0.15s', fontFamily: "'DM Sans', sans-serif",
  },
};