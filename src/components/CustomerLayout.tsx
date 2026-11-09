import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Shield, Dumbbell, LogOut, LogIn } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export default function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const displayName = (() => {
    const metadata = session?.user.user_metadata || {};
    const fullName = metadata.full_name || metadata.name || metadata.display_name;
    const name = typeof fullName === 'string' ? fullName.trim() : '';
    if (name) return name.split(/\s+/)[0];
    const email = session?.user.email || '';
    return email.includes('@') ? email.split('@')[0] : 'Pengguna';
  })();

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    async function checkAdmin(nextSession: Session | null) {
      if (active) {
        setSession(nextSession);
        setIsAdmin(false);
      }
      if (!nextSession) return;
      try {
        const response = await fetch('/api/admin/login', {
          headers: { Authorization: `Bearer ${nextSession.access_token}` },
          credentials: 'same-origin',
        });
        const result = await response.json();
        if (active) setIsAdmin(response.ok && result.isAdmin === true);
      } catch {
        if (active) setIsAdmin(false);
      }
    }
    void supabase.auth.getSession().then(({ data }) => checkAdmin(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void checkAdmin(nextSession);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase?.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-800">
      <header className="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 min-h-16 py-2 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              Sport<span className="text-brand-400">Futsal</span>
            </span>
          </Link>
          <nav className="flex items-center justify-end gap-1 flex-wrap">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/' ? 'bg-brand-500/20 text-brand-400' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </Link>
            <Link
              to="/cek-booking"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/cek-booking' ? 'bg-brand-500/20 text-brand-400' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Cek Booking</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 text-white/60 hover:text-white hover:bg-white/5"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            {session ? (
              <>
                <span className="px-2 py-2 text-sm font-semibold text-brand-300 whitespace-nowrap">
                  Hi, {displayName}
                </span>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 text-white/60 hover:text-white hover:bg-white/5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 bg-brand-500 text-white hover:bg-brand-400"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-white/40">
        <p>&copy; 2025 SportFutsal - Sistem Booking Lapangan Futsal &amp; Badminton</p>
      </footer>
    </div>
  );
}
