import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Search, Shield, Dumbbell } from 'lucide-react';

export default function CustomerLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-navy-800">
      <header className="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              Sport<span className="text-brand-400">Futsal</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/' ? 'bg-brand-500/20 text-brand-400' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Beranda</span>
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
            <Link
              to="/admin/login"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 text-white/60 hover:text-white hover:bg-white/5"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
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
