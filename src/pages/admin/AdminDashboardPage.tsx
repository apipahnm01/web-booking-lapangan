import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList, Users, CreditCard, CheckSquare, Calendar,
  TrendingUp, ArrowRight, Circle, ScanLine, FileBarChart,
} from 'lucide-react';
import { getBookings, getPayments, getCheckIns, getCustomers, formatRupiah } from '@/lib/store';
import { COURTS } from '@/lib/constants';

export default function AdminDashboardPage() {
  const bookings = useMemo(() => getBookings(), []);
  const payments = useMemo(() => getPayments(), []);
  const checkIns = useMemo(() => getCheckIns(), []);
  const customers = useMemo(() => getCustomers(), []);

  const totalRevenue = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);
  const paidBookings = bookings.filter(b => b.status === 'paid').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const checkedInCount = checkIns.length;

  const stats = [
    { label: 'Total Pendapatan', value: formatRupiah(totalRevenue), icon: TrendingUp, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Total Booking', value: bookings.length, icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Booking Lunas', value: paidBookings, icon: CheckSquare, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Menunggu Bayar', value: pendingBookings, icon: CreditCard, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Check-in', value: checkedInCount, icon: CheckSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Customer', value: customers.length, icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  const quickActions = [
    { to: '/admin/scan', label: 'Scan QR Check-in', icon: ScanLine, desc: 'Pindai QR Code customer' },
    { to: '/admin/booking', label: 'Kelola Booking', icon: ClipboardList, desc: 'Lihat semua booking' },
    { to: '/admin/laporan', label: 'Laporan & Export', icon: FileBarChart, desc: 'Lihat dan ekspor data' },
    { to: '/admin/jadwal', label: 'Lihat Jadwal', icon: Calendar, desc: 'Jadwal semua lapangan' },
  ];

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1">Dashboard</h1>
        <p className="text-white/50">Ringkasan aktivitas booking lapangan.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-xs text-white/40 mb-1">{s.label}</p>
              <p className="text-lg font-display font-bold text-white">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((a, i) => {
          const Icon = a.icon;
          return (
            <Link
              key={i}
              to={a.to}
              className="card group hover:border-brand-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{a.label}</h3>
              <p className="text-xs text-white/40">{a.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent bookings + courts overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white">Booking Terbaru</h2>
            <Link to="/admin/booking" className="text-brand-400 text-sm hover:underline">Lihat Semua</Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-8">Belum ada booking.</p>
          ) : (
            <div className="space-y-2">
              {recentBookings.map(b => (
                <div key={b.id} className="flex items-center gap-3 pb-3 border-b border-white/5 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                    <Circle className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{b.customerName} - {b.courtName}</p>
                    <p className="text-white/40 text-xs">{b.date} {b.startTime} - {b.endTime}</p>
                  </div>
                  <span className="text-brand-400 text-sm font-medium flex-shrink-0">{formatRupiah(b.totalPrice)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-white mb-4">Status Lapangan</h2>
          <div className="space-y-3">
            {COURTS.map(c => {
              const courtBookings = bookings.filter(b => b.courtId === c.id && b.status !== 'cancelled');
              return (
                <div key={c.id} className="flex items-center justify-between pb-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center">
                      <Circle className="w-4 h-4 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{c.name}</p>
                      <p className="text-white/40 text-xs capitalize">{c.sport} - {formatRupiah(c.pricePerHour)}/jam</p>
                    </div>
                  </div>
                  <span className="text-white/60 text-sm">{courtBookings.length} booking</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
