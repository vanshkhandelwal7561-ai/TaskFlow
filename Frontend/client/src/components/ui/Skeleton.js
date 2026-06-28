export default function Skeleton({ width = '100%', height = '20px', borderRadius = '6px', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function BoardCardSkeleton() {
  return (
    <div className="board-card skeleton-card">
      <Skeleton height="24px" width="60%" />
      <Skeleton height="16px" width="80%" />
      <Skeleton height="16px" width="40%" />
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="task-card skeleton-card">
      <Skeleton height="18px" width="75%" />
      <Skeleton height="14px" width="50%" />
      <Skeleton height="14px" width="40%" />
    </div>
  );
}
