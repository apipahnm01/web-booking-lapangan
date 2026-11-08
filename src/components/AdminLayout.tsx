import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Circle, Calendar, ClipboardList, Users,
  CreditCard, ScanLine, CheckSquare, FileBarChart, LogOut, Dumbbell, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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
        return <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.to) ? 'bg-brand-500 text-white shadow-lg shadow-black/20' : 'text-white/55 hover:text-white hover:bg-white/[0.06]'}`}>
          <Icon className="w-5 h-5" />{item.label}
        </Link>;
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-navy-800">
      <aside className="hidden lg:flex flex-col w-64 bg-navy-900 border-r border-white/10 fixed h-screen">
        <div className="h-[76px] flex items-center gap-3 px-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-full border border-brand-300/50 flex items-center justify-center text-brand-200"><Dumbbell className="w-5 h-5" strokeWidth={1.4}/></div>
          <span className="font-display font-semibold text-2xl text-[#f5eee4]">Sport<span className="italic text-brand-300">Admin</span></span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{navContent}</div>
        <div className="p-4 border-t border-white/10"><button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition-all w-full"><LogOut className="w-5 h-5"/>Keluar</button></div>
      </aside>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-navy-900 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full border border-brand-300/50 flex items-center justify-center text-brand-200"><Dumbbell className="w-4 h-4"/></div><span className="font-display text-xl text-white">Sport<span className="italic text-brand-300">Admin</span></span></div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-white/5 text-white">{mobileOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}</button>
      </div>
      {mobileOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)}><div className="absolute left-0 top-16 bottom-0 w-64 bg-navy-900 border-r border-white/10 p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>{navContent}<button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition-all w-full mt-2"><LogOut className="w-5 h-5"/>Keluar</button></div></div>}
      <div className="flex-1 lg:ml-64 pt-16 lg:pt-0"><Outlet/></div>
    </div>
  );
}