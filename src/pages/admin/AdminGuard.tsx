import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AdminGuard() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabase) {
      setIsAdmin(false);
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setIsAdmin(data.session?.user.app_metadata?.role === 'admin');
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setIsAdmin(session?.user.app_metadata?.role === 'admin');
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center bg-navy-900 text-white/60">Memeriksa akses admin...</div>;
  }
  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
