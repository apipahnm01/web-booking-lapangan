import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export default function RequireAuth() {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) { setSession(data.session); setReady(true); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) { setSession(nextSession); setReady(true); }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);
  if (!ready) return <div className="min-h-screen flex items-center justify-center bg-navy-900 text-white/60">Memeriksa sesi login...</div>;
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}
