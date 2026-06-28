import { useState, useEffect } from 'react';
import Modal from './Modal';
import { createBoard, updateBoard } from '../../api';
import toast from 'react-hot-toast';

export default function BoardModal({ board, onClose, onSaved }) {
  const editing = !!board;
  const [form, setForm] = useState({ title:'', description:'' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (board) setForm({ title: board.title, description: board.description||'' });
  }, [board]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required.'); return; }
    setSaving(true);
    try {
      const res = editing ? await updateBoard(board._id, form) : await createBoard(form);
      toast.success(editing ? 'Board updated!' : 'Board created!');
      onSaved(res.data.data); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save.');
    } finally { setSaving(false); }
  };

  return (
    <Modal title={editing ? 'Edit Board' : 'New Board'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-field" style={{marginBottom:14}}>
          <label className="form-label">Board name *</label>
          <input className="input" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Q3 Launch" autoFocus />
        </div>
        <div className="form-field" style={{marginBottom:0}}>
          <label className="form-label">Description</label>
          <textarea className="input textarea" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="What is this board for?" rows={3} />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <span className="spinner-sm"/> : (editing ? 'Save changes' : 'Create board')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
