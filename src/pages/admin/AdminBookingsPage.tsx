import { useState, useMemo } from 'react';
import {
  getBookings, cancelBooking, formatRupiah, formatDate, exportToCSV,
} from '@/lib/store';
import type { Booking } from '@/lib/types';
import { ClipboardList, Search, X, Check, Clock, Ban, Download } from 'lucide-react';

const statusConfig: Record<Booking['status'], { label: string; color: string; icon: typeof Check }> = {
  pending: { label: 'Menunggu', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  paid: { label: 'Lunas', color: 'bg-brand-500/20 text-brand-400', icon: Check },
  cancelled: { label: 'Batal', color: 'bg-red-500/20 text-red-400', icon: Ban },
  checked_in: { label: 'Check-in', color: 'bg-blue-500/20 text-blue-400', icon: Check },
};

export default function AdminBookingsPage() {
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const bookings = useMemo(() => getBookings(), [refresh]);

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchSearch =
        !search ||
        b.token.toLowerCase().includes(search.toLowerCase()) ||
        b.customerName.toLowerCase().includes(search.toLowerCase()) ||
        b.customerPhone.includes(search) ||
        b.courtName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || b.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, filterStatus]);

  function handleCancel(id: string) {
    if (confirm('Batalkan booking ini?')) {
      cancelBooking(id);
      setRefresh(r => r + 1);
    }
  }

  function handleExport() {
    exportToCSV(
      'booking-report.csv',
      ['Kode', 'Nama', 'HP', 'Lapangan', 'Tanggal', 'Jam Mulai', 'Jam Selesai', 'Durasi', 'Total', 'Status', 'Metode Bayar'],
      filtered.map(b => [
        b.token, b.customerName, b.customerPhone, b.courtName, b.date,
        b.startTime, b.endTime, `${b.duration} jam`, b.totalPrice, b.status, b.paymentMethod,
      ])
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Booking</h1>
          <p className="text-white/50">Kelola semua data booking.</p>
        </div>
        <button onClick={handleExport} className="btn-secondary">
          <Download className="w-5 h-5" /> Export CSV
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode, nama, HP, lapangan..."
              className="input-field pl-11"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="all" className="bg-navy-700">Semua Status</option>
            <option value="pending" className="bg-navy-700">Menunggu</option>
            <option value="paid" className="bg-navy-700">Lunas</option>
            <option value="checked_in" className="bg-navy-700">Check-in</option>
            <option value="cancelled" className="bg-navy-700">Batal</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <ClipboardList className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">Tidak ada booking ditemukan.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block card overflow-x-auto p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-medium text-white/40 uppercase px-4 py-3">Kode</th>
                  <th className="text-left text-xs font-medium text-white/40 uppercase px-4 py-3">Customer</th>
                  <th className="text-left text-xs font-medium text-white/40 uppercase px-4 py-3">Lapangan</th>
                  <th className="text-left text-xs font-medium text-white/40 uppercase px-4 py-3">Tanggal</th>
                  <th className="text-left text-xs font-medium text-white/40 uppercase px-4 py-3">Jam</th>
                  <th className="text-right text-xs font-medium text-white/40 uppercase px-4 py-3">Total</th>
                  <th className="text-center text-xs font-medium text-white/40 uppercase px-4 py-3">Status</th>
                  <th className="text-center text-xs font-medium text-white/40 uppercase px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const StatusIcon = statusConfig[b.status].icon;
                  return (
                    <tr key={b.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3 font-mono text-brand-400 text-sm">{b.token}</td>
                      <td className="px-4 py-3">
                        <p className="text-white text-sm font-medium">{b.customerName}</p>
                        <p className="text-white/40 text-xs">{b.customerPhone}</p>
                      </td>
                      <td className="px-4 py-3 text-white/70 text-sm">{b.courtName}</td>
                      <td className="px-4 py-3 text-white/70 text-sm">{b.date}</td>
                      <td className="px-4 py-3 text-white/70 text-sm">{b.startTime}-{b.endTime}</td>
                      <td className="px-4 py-3 text-right text-brand-400 font-medium text-sm">{formatRupiah(b.totalPrice)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[b.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[b.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {(b.status === 'pending' || b.status === 'paid') && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="text-red-400 hover:text-red-300 text-xs font-medium"
                          >
                            Batalkan
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(b => {
              const StatusIcon = statusConfig[b.status].icon;
              return (
                <div key={b.id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-brand-400 text-sm">{b.token}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[b.status].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[b.status].label}
                    </span>
                  </div>
                  <p className="text-white font-medium">{b.customerName} - {b.customerPhone}</p>
                  <p className="text-white/50 text-sm">{b.courtName} - {b.date} {b.startTime}-{b.endTime}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <span className="text-brand-400 font-bold">{formatRupiah(b.totalPrice)}</span>
                    {(b.status === 'pending' || b.status === 'paid') && (
                      <button onClick={() => handleCancel(b.id)} className="text-red-400 text-xs font-medium">Batalkan</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
