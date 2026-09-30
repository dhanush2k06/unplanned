import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
  const { loading, isAdmin, configured } = useAuth();
  const location = useLocation();

  if (!configured) {
    return <Navigate to="/login" replace />;
  }
  if (loading) {
    return <div className="p-10 text-admin-muted">Checking session…</div>;
  }
  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
