import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function AdminGuard() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/login', { credentials: 'same-origin' })
      .then(async response => {
        const result = await response.json();
        if (active) setIsAdmin(response.ok && result.authenticated === true);
      })
      .catch(() => { if (active) setIsAdmin(false); });
    return () => { active = false; };
  }, [location.pathname]);

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center bg-navy-900 text-white/60">Memeriksa akses admin...</div>;
  }
  if (!isAdmin) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <Outlet />;
}
