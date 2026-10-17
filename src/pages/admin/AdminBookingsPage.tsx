import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatRupiah, exportToCSV } from '@/lib/store';
import { ClipboardList, Search, Check, Clock, Ban, Download, RefreshCw } from 'lucide-react';

type BookingRow = {
  id: string;
  token: string;
  court_name: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_price: number;
  status: 'pending' | 'paid' | 'cancelled' | 'checked_in';
  payment_method: string;
  created_at: string;
};

const statusConfig = {
  pending: { label: 'Menunggu', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  paid: { label: 'Lunas', color: 'bg-brand-500/20 text-brand-400', icon: Check },
  cancelled: { label: 'Batal', color: 'bg-red-500/20 text-red-400', icon: Ban },
  checked_in: { label: 'Check-in', color: 'bg-blue-500/20 text-blue-400', icon: Check },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBookings = useCallback(async () => {
    if (!supabase) {
      setError('Konfigurasi Supabase belum tersedia.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const { data, error: queryError } = await supabase
      .from('bookings')
      .select('id, token, court_name, customer_name, customer_phone, customer_email, booking_date, start_time, end_time, duration, total_price, status, payment_method, created_at')
      .order('created_at', { ascending: false });

    if (queryError) {
      setError(queryError.message.includes('permission') || queryError.message.includes('policy')
        ? 'Akses admin belum diaktifkan. Pastikan akun Supabase memiliki role admin.'
        : queryError.message);
      setBookings([]);
    } else {
      setBookings((data ?? []) as BookingRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void loadBookings(); }, [loadBookings]);

  const filtered = useMemo(() => bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b.token.toLowerCase().includes(q) ||
      b.customer_name.toLowerCase().includes(q) ||
      b.customer_phone.includes(search) ||
      b.court_name.toLowerCase().includes(q);
    return matchSearch && (filterStatus === 'all' || b.status === filterStatus);
  }), [bookings, search, filterStatus]);

  async function handleCancel(id: string) {
    if (!supabase || !confirm('Batalkan booking ini?')) return;
    const { error: updateError } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    if (updateError) {
      alert('Booking belum berhasil dibatalkan: ' + updateError.message);
      return;
    }
    await loadBookings();
  }

  function handleExport() {
    exportToCSV(
      'booking-report.csv',
      ['Kode', 'Nama', 'HP', 'Lapangan', 'Tanggal', 'Jam Mulai', 'Jam Selesai', 'Durasi', 'Total', 'Status', 'Metode Bayar'],
      filtered.map((b) => [b.token, b.customer_name, b.customer_phone, b.court_name, b.booking_date,
        b.start_time, b.end_time, `${b.duration} jam`, b.total_price, b.status, b.payment_method])
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Booking</h1>
          <p className="text-white/50">Data diambil langsung dari database Supabase.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void loadBookings()} className="btn-secondary" disabled={loading}>
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /> Muat ulang
          </button>
          <button onClick={handleExport} className="btn-secondary" disabled={!filtered.length}>
            <Download className="w-5 h-5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode, nama, HP, lapangan..." className="input-field pl-11" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field sm:w-48">
            <option value="all" className="bg-navy-700">Semua Status</option>
            <option value="pending" className="bg-navy-700">Menunggu</option>
            <option value="paid" className="bg-navy-700">Lunas</option>
            <option value="checked_in" className="bg-navy-700">Check-in</option>
            <option value="cancelled" className="bg-navy-700">Batal</option>
          </select>
        </div>
      </div>

      {error && <div className="card mb-4 border border-red-500/30 text-red-300 text-sm">{error}</div>}
      {loading ? (
        <div className="card text-center py-12 text-white/50">Memuat data booking dari Supabase...</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <ClipboardList className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/50">{error ? 'Data belum dapat dimuat.' : 'Tidak ada booking ditemukan.'}</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block card overflow-x-auto p-0">
            <table className="w-full">
              <thead><tr className="border-b border-white/10">
                {['Kode', 'Customer', 'Lapangan', 'Tanggal', 'Jam', 'Total', 'Status', 'Aksi'].map((label) =>
                  <th key={label} className="text-left text-xs font-medium text-white/40 uppercase px-4 py-3">{label}</th>)}
              </tr></thead>
              <tbody>{filtered.map((b) => {
                const StatusIcon = statusConfig[b.status].icon;
                return <tr key={b.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-brand-400 text-sm">{b.token}</td>
                  <td className="px-4 py-3"><p className="text-white text-sm font-medium">{b.customer_name}</p><p className="text-white/40 text-xs">{b.customer_phone}</p></td>
                  <td className="px-4 py-3 text-white/70 text-sm">{b.court_name}</td>
                  <td className="px-4 py-3 text-white/70 text-sm">{b.booking_date}</td>
                  <td className="px-4 py-3 text-white/70 text-sm">{b.start_time}-{b.end_time}</td>
                  <td className="px-4 py-3 text-right text-brand-400 font-medium text-sm">{formatRupiah(b.total_price)}</td>
                  <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[b.status].color}`}><StatusIcon className="w-3 h-3" />{statusConfig[b.status].label}</span></td>
                  <td className="px-4 py-3 text-center">{b.status === 'pending' && <button onClick={() => void handleCancel(b.id)} className="text-red-400 hover:text-red-300 text-xs font-medium">Batalkan</button>}</td>
                </tr>;
              })}</tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">{filtered.map((b) => {
            const StatusIcon = statusConfig[b.status].icon;
            return <div key={b.id} className="card">
              <div className="flex items-center justify-between mb-3"><span className="font-mono text-brand-400 text-sm">{b.token}</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[b.status].color}`}><StatusIcon className="w-3 h-3" />{statusConfig[b.status].label}</span></div>
              <p className="text-white font-medium">{b.customer_name} - {b.customer_phone}</p>
              <p className="text-white/50 text-sm">{b.court_name} - {b.booking_date} {b.start_time}-{b.end_time}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10"><span className="text-brand-400 font-bold">{formatRupiah(b.total_price)}</span>
                {b.status === 'pending' && <button onClick={() => void handleCancel(b.id)} className="text-red-400 text-xs font-medium">Batalkan</button>}</div>
            </div>;
          })}</div>
        </>
      )}
    </div>
  );
}
