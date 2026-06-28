import { useNavigate } from 'react-router-dom';
import { Trash2, Pencil, LayoutGrid } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function BoardCard({ board, onEdit, onDelete }) {
  const navigate = useNavigate();
  const ago = board.createdAt ? formatDistanceToNow(new Date(board.createdAt), { addSuffix: true }) : '';

  return (
    <div className="board-card" onClick={() => navigate(`/board/${board._id}`)}>
      <div className="board-card-top">
        <div className="board-card-icon"><LayoutGrid size={18} /></div>
        <div className="board-card-menu" onClick={e => e.stopPropagation()}>
          <button className="icon-btn" title="Edit" onClick={() => onEdit(board)}><Pencil size={13} /></button>
          <button className="icon-btn danger" title="Delete" onClick={() => onDelete(board)}><Trash2 size={13} /></button>
        </div>
      </div>
      <h3 className="board-card-title">{board.title}</h3>
      <p className="board-card-desc">{board.description || 'No description added yet.'}</p>
      <div className="board-card-footer">
        <span className="board-task-count">
          <LayoutGrid size={12} />
          {board.taskCount ?? 0} task{board.taskCount !== 1 ? 's' : ''}
        </span>
        <span className="board-date">{ago}</span>
      </div>
    </div>
  );
}
