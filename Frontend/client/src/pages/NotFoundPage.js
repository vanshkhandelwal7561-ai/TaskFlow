import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found-inner">
        <div className="not-found-num">404</div>
        <h2 className="not-found-title">Page not found</h2>
        <p className="not-found-body">This page doesn't exist or was moved. Let's get you back.</p>
        <Link to="/" className="btn btn-primary">
          <LayoutDashboard size={15}/> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
