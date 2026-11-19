import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Circle, Calendar, ClipboardList, Users,
  CreditCard, ScanLine, CheckSquare, FileBarChart, LogOut, Dumbbell, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/lapangan', label: 'Lapangan', icon: Circle },
  { to: '/admin/jadwal', label: 'Jadwal', icon: Calendar },
  { to: '/admin/booking', label: 'Booking', icon: ClipboardList },
  { to: '/admin/customer', label: 'Customer', icon: Users },
  { to: '/admin/pembayaran', label: 'Pembayaran', icon: CreditCard },
  { to: '/admin/scan', label: 'Scan QR', icon: ScanLine },
  { to: '/admin/check-in', label: 'Check-in', icon: CheckSquare },
  { to: '/admin/laporan', label: 'Laporan', icon: FileBarChart },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE', credentials: 'same-origin' });
    await supabase?.auth.signOut();
    navigate('/admin/login', { replace: true });
  }

  const navContent = (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(item.to)
                ? 'bg-black text-white shadow-lg shadow-black/10'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="admin-shell min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="admin-sidebar hidden lg:flex flex-col w-64 fixed h-screen">
        <div className="admin-brand h-16 flex items-center justify-between gap-2 px-5 border-b">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-neutral-900">
              Sport<span className="text-neutral-500">Admin</span>
            </span>
          </div>
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {navContent}
        </div>
        <div className="admin-sidebar-footer p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="admin-mobile-header lg:hidden fixed top-0 left-0 right-0 z-50 min-h-16 border-b flex items-center justify-between gap-2 px-3 sm:px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="admin-brand-name font-display font-bold text-neutral-900 text-sm sm:text-base">CourtSpace Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="admin-menu-trigger p-2 rounded-lg">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="admin-mobile-drawer absolute left-0 top-16 bottom-0 w-64 border-r p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all w-full mt-2">
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="admin-main flex-1 lg:ml-64 pt-16 lg:pt-0">
        <Outlet />
      </div>
    </div>
  );
}
