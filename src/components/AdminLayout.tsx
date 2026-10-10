import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Circle, Calendar, ClipboardList, Users,
  CreditCard, ScanLine, CheckSquare, FileBarChart, LogOut, Dumbbell, Menu, X,
} from 'lucide-react';
import { useState } from 'react';

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

  function handleLogout() {
    sessionStorage.removeItem('sf_admin_authed');
    navigate('/admin/login');
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
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
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
    <div className="min-h-screen flex bg-navy-800">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-navy-900 border-r border-white/10 fixed h-screen">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            Sport<span className="text-brand-400">Admin</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {navContent}
        </div>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all w-full">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-navy-900 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white">SportAdmin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-white/5 text-white">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-16 bottom-0 w-64 bg-navy-900 border-r border-white/10 p-4 overflow-y-auto"
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
      <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <Outlet />
      </div>
    </div>
  );
}
