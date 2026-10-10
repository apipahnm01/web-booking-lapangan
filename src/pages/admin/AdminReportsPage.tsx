import { useMemo, useState } from 'react';
import { getBookings, getPayments, getCheckIns, getCustomers, formatRupiah, exportToCSV } from '@/lib/store';
import { COURTS } from '@/lib/constants';
import { FileBarChart, Download, TrendingUp, ClipboardList, Users, CheckSquare, Circle } from 'lucide-react';

type ReportType = 'bookings' | 'payments' | 'checkins' | 'customers';

export default function AdminReportsPage() {
  const bookings = useMemo(() => getBookings(), []);
  const payments = useMemo(() => getPayments(), []);
  const checkIns = useMemo(() => getCheckIns(), []);
  const customers = useMemo(() => getCustomers(), []);
  const [reportType, setReportType] = useState<ReportType>('bookings');

  const totalRevenue = payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);
  const paidBookings = bookings.filter(b => b.status === 'paid' || b.status === 'checked_in');

  const revenueByCourt = COURTS.map(c => {
    const courtBookings = bookings.filter(b => b.courtId === c.id && (b.status === 'paid' || b.status === 'checked_in'));
    return {
      name: c.name,
      sport: c.sport,
      count: courtBookings.length,
      revenue: courtBookings.reduce((s, b) => s + b.totalPrice, 0),
    };
  });

  function handleExport() {
    if (reportType === 'bookings') {
      exportToCSV('laporan-booking.csv',
        ['Kode', 'Customer', 'HP', 'Lapangan', 'Tanggal', 'Jam', 'Durasi', 'Total', 'Status', 'Metode'],
        bookings.map(b => [b.token, b.customerName, b.customerPhone, b.courtName, b.date, `${b.startTime}-${b.endTime}`, `${b.duration} jam`, b.totalPrice, b.status, b.paymentMethod])
      );
    } else if (reportType === 'payments') {
      exportToCSV('laporan-pembayaran.csv',
        ['Kode Booking', 'Jumlah', 'Metode', 'Status', 'Tanggal'],
        payments.map(p => [p.bookingToken, p.amount, p.method, p.status, p.createdAt])
      );
    } else if (reportType === 'checkins') {
      exportToCSV('laporan-checkin.csv',
        ['Kode Booking', 'Customer', 'Lapangan', 'Tanggal', 'Jam', 'Check-in Pada'],
        checkIns.map(c => [c.bookingToken, c.customerName, c.courtName, c.date, `${c.startTime}-${c.endTime}`, c.checkedInAt])
      );
    } else {
      exportToCSV('laporan-customer.csv',
        ['Nama', 'HP', 'Email', 'Total Booking', 'Total Belanja'],
        customers.map(c => [c.name, c.phone, c.email, c.bookings, c.totalSpent])
      );
    }
  }

  function handleExportAll() {
    exportToCSV('laporan-ringkasan.csv',
      ['Metrik', 'Nilai'],
      [
        ['Total Pendapatan', totalRevenue],
        ['Total Booking', bookings.length],
        ['Booking Lunas', paidBookings.length],
        ['Total Check-in', checkIns.length],
        ['Total Customer', customers.length],
        ...revenueByCourt.map(r => [`Pendapatan ${r.name}`, r.revenue]),
      ]
    );
  }

  const reportTypes: { key: ReportType; label: string; icon: typeof ClipboardList }[] = [
    { key: 'bookings', label: 'Booking', icon: ClipboardList },
    { key: 'payments', label: 'Pembayaran', icon: TrendingUp },
    { key: 'checkins', label: 'Check-in', icon: CheckSquare },
    { key: 'customers', label: 'Customer', icon: Users },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Laporan</h1>
          <p className="text-white/50">Ringkasan dan ekspor data.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportAll} className="btn-secondary">
            <Download className="w-5 h-5" /> Ringkasan CSV
          </button>
          <button onClick={handleExport} className="btn-primary">
            <Download className="w-5 h-5" /> Export {reportTypes.find(r => r.key === reportType)?.label}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Pendapatan', value: formatRupiah(totalRevenue), icon: TrendingUp, color: 'text-brand-400', bg: 'bg-brand-500/10' },
          { label: 'Total Booking', value: bookings.length, icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Check-in', value: checkIns.length, icon: CheckSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Customer', value: customers.length, icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-xs text-white/40 mb-1">{s.label}</p>
              <p className="text-lg font-display font-bold text-white">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue by court */}
      <div className="card mb-8">
        <h2 className="font-display font-bold text-white mb-4">Pendapatan per Lapangan</h2>
        <div className="space-y-3">
          {revenueByCourt.map(r => {
            const maxRevenue = Math.max(...revenueByCourt.map(x => x.revenue), 1);
            const pct = (r.revenue / maxRevenue) * 100;
            return (
              <div key={r.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-brand-400" />
                    <span className="text-white text-sm font-medium">{r.name}</span>
                    <span className="text-white/30 text-xs">({r.count} booking)</span>
                  </div>
                  <span className="text-brand-400 font-medium text-sm">{formatRupiah(r.revenue)}</span>
                </div>
                <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report type selector */}
      <div className="card">
        <h2 className="font-display font-bold text-white mb-4">Pilih Laporan untuk Export</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {reportTypes.map(r => {
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                onClick={() => setReportType(r.key)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${
                  reportType === r.key
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-navy-700 text-white/60 border-white/10 hover:bg-navy-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-white/40 text-sm">
          <FileBarChart className="w-4 h-4" />
          Klik "Export" untuk mengunduh data {reportTypes.find(r => r.key === reportType)?.label} dalam format CSV.
        </div>
      </div>
    </div>
  );
}
