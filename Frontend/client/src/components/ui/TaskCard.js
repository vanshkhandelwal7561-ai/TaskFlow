import { format, isPast, parseISO } from 'date-fns';
import { Pencil, Trash2, Calendar, Clock } from 'lucide-react';

const LABELS = { low: 'Low', medium: 'Medium', high: 'High' };

export default function TaskCard({ task, onEdit, onDelete, onMove }) {
  const isOverdue = task.dueDate && task.status !== 'done' && isPast(parseISO(task.dueDate));

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-card-row1">
        <span className={`badge badge-${task.priority}`}>{LABELS[task.priority]}</span>
        <div className="task-card-actions">
          <button className="icon-btn" style={{width:24,height:24}} onClick={() => onEdit(task)} title="Edit"><Pencil size={12} /></button>
          <button className="icon-btn danger" style={{width:24,height:24}} onClick={() => onDelete(task)} title="Delete"><Trash2 size={12} /></button>
        </div>
      </div>

      <p className="task-title">{task.title}</p>
      {task.description && <p className="task-desc">{task.description}</p>}

      {(task.dueDate || task.estimatedEffort) && (
        <div className="task-meta-row">
          {task.dueDate && (
            <span className={`task-chip ${isOverdue ? 'overdue-chip' : ''}`}>
              <Calendar size={11} />
              {format(parseISO(task.dueDate), 'MMM d')}
              {isOverdue && ' · Overdue'}
            </span>
          )}
          {task.estimatedEffort && (
            <span className="task-chip">
              <Clock size={11} />
              {task.estimatedEffort}
            </span>
          )}
        </div>
      )}

      <div className="task-move-row">
        {task.status !== 'todo' && (
          <button className="move-btn" onClick={() => onMove(task, task.status === 'in-progress' ? 'todo' : 'in-progress')}>
            ← {task.status === 'done' ? 'In Progress' : 'To Do'}
          </button>
        )}
        {task.status !== 'done' && (
          <button className="move-btn" onClick={() => onMove(task, task.status === 'todo' ? 'in-progress' : 'done')}>
            {task.status === 'todo' ? 'In Progress' : 'Done'} →
          </button>
        )}
      </div>
    </div>
  );
}
