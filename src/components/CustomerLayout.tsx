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
    if (name) return name.split(/\\s+/)[0];
    const email = session?.user.email || '';
    return email.includes('@') ? email.split('@')[0] : 'Pengguna';
  })();

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    async function checkAdmin(nextSession: Session | null) {
      if (active) { setSession(nextSession); setIsAdmin(false); }
      if (!nextSession) return;
      try {
        const response = await fetch('/api/admin/login', { headers: { Authorization: `Bearer ${nextSession.access_token}` }, credentials: 'same-origin' });
        const result = await response.json();
        if (active) setIsAdmin(response.ok && result.isAdmin === true);
      } catch { if (active) setIsAdmin(false); }
    }
    void supabase.auth.getSession().then(({ data }) => checkAdmin(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => { void checkAdmin(nextSession); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function handleLogout() {
    await supabase?.auth.signOut();
    setSession(null); setIsAdmin(false); navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-800">
      <header className="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 min-h-[76px] py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-full border border-brand-300/50 flex items-center justify-center text-brand-200 group-hover:bg-brand-500/15 transition-colors">
              <Dumbbell className="w-5 h-5" strokeWidth={1.4} />
            </div>
            <span className="font-display font-semibold text-2xl tracking-tight text-[#f5eee4]">Sport<span className="italic text-brand-300">Booking</span></span>
          </Link>
          <nav className="flex items-center justify-end gap-1 flex-wrap">
            <Link to="/" className={`px-3 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${location.pathname === '/' ? 'bg-brand-500/20 text-brand-200' : 'text-white/55 hover:text-white hover:bg-white/5'}`}>
              <Home className="w-4 h-4" /><span>Beranda</span>
            </Link>
            <Link to="/cek-booking" className={`px-3 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${location.pathname === '/cek-booking' ? 'bg-brand-500/20 text-brand-200' : 'text-white/55 hover:text-white hover:bg-white/5'}`}>
              <Search className="w-4 h-4" /><span className="hidden sm:inline">Cek Booking</span>
            </Link>
            {isAdmin && <Link to="/admin/dashboard" className="px-3 py-2 rounded-full text-xs font-semibold tracking-wide text-white/55 hover:text-white hover:bg-white/5 flex items-center gap-1.5"><Shield className="w-4 h-4"/><span>Admin</span></Link>}
            {session ? <><span className="px-2 py-2 text-xs font-semibold text-brand-200 whitespace-nowrap">Hi, {displayName}</span><button type="button" onClick={() => void handleLogout()} className="px-3 py-2 rounded-full text-xs font-semibold text-white/55 hover:text-white hover:bg-white/5 flex items-center gap-1.5"><LogOut className="w-4 h-4"/><span>Keluar</span></button></> :
              <Link to="/login" className="px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide bg-brand-500 text-white hover:bg-brand-400 transition-colors flex items-center gap-1.5"><LogIn className="w-4 h-4"/><span>Login</span></Link>}
          </nav>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-white/10 py-7 text-center text-[10px] uppercase tracking-[.2em] text-white/30">
        <p>&copy; 2026 SportBooking · Sistem Booking Lapangan Futsal &amp; Badminton</p>
      </footer>
    </div>
  );
}