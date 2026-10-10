import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function AdminGuard() {
  const location = useLocation();
  const authed = sessionStorage.getItem('sf_admin_authed') === 'true';

  if (!authed) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
