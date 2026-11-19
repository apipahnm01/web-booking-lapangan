import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, LogOut, LogIn, Shield, CalendarDays, Search } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';

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

  const onHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f3]">
      {!onHome && (<header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-3 px-5 py-3 md:px-10">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black shadow-lg shadow-black/10"><Dumbbell className="h-6 w-6 text-white" /></div>
            <span className="text-lg font-extrabold tracking-tight text-neutral-900 sm:text-xl md:text-2xl">Sport<span className="text-neutral-500">Futsal</span></span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            <Link to="/" className={`text-sm font-semibold transition ${onHome ? 'text-neutral-800' : 'text-slate-600 hover:text-blue-700'}`}>Home</Link>
            <a href="/#daftar-lapangan" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">Lapangan</a>
            <a href="/#cara-booking" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">Cara Booking</a>
            <Link to="/cek-booking" className={`text-sm font-semibold transition ${location.pathname === '/cek-booking' ? 'text-blue-700' : 'text-slate-600 hover:text-blue-700'}`}>Cek Booking</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAdmin && <Link to="/admin/dashboard" className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-neutral-100 hover:text-black sm:inline-flex"><Shield className="h-4 w-4" /> Admin</Link>}
            {session ? (
              <>
                <span className="hidden whitespace-nowrap text-sm font-semibold text-blue-700 sm:inline">Hi, {displayName}</span>
                <button type="button" onClick={() => void handleLogout()} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-neutral-100"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Keluar</span></button>
              </>
            ) : (
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-black/10 transition hover:bg-neutral-700 md:px-6"><LogIn className="h-4 w-4" /><span>Login dengan Google</span></Link>
            )}
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-5 pb-3 lg:hidden md:px-10">
          <Link to="/" className="whitespace-nowrap text-xs font-semibold text-slate-600">Home</Link>
          <a href="/#daftar-lapangan" className="whitespace-nowrap text-xs font-semibold text-slate-600">Lapangan</a>
          <a href="/#cara-booking" className="whitespace-nowrap text-xs font-semibold text-slate-600">Cara Booking</a>
          <Link to="/cek-booking" className="whitespace-nowrap text-xs font-semibold text-slate-600">Cek Booking</Link>
          {isAdmin && <Link to="/admin/dashboard" className="whitespace-nowrap text-xs font-semibold text-blue-700">Admin</Link>}
        </div>
      </header>)}

      <main className="flex-1"><Outlet /></main>

      <footer className="border-t border-neutral-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 text-center md:flex-row md:px-10 md:text-left">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-neutral-900"> <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600"><Dumbbell className="h-4 w-4 text-white" /></span> Sport<span className="-ml-2 text-neutral-500">Futsal</span></Link>
          <p className="text-sm text-slate-500">© 2026 SportFutsal · Sistem Booking Lapangan Futsal &amp; Badminton</p>
          <Link to="/cek-booking" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"><Search className="h-4 w-4" /> Cek Booking <CalendarDays className="h-4 w-4" /></Link>
        </div>
      </footer>
    </div>
  );
}
