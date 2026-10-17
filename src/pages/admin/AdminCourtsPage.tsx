import { useAdminData } from '@/lib/useAdminData';
import { formatRupiah } from '@/lib/store';
import { Dumbbell, Circle, RefreshCw } from 'lucide-react';

export default function AdminCourtsPage() {
  const { courts, bookings, loading, error, reload } = useAdminData();
  return <div className="p-6 lg:p-8">
    <div className="flex items-center justify-between mb-8"><div><h1 className="text-2xl font-display font-bold text-white mb-1">Lapangan</h1><p className="text-white/50">Daftar lapangan diambil dari database.</p></div><button onClick={() => void reload()} className="btn-secondary" disabled={loading}><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}/> Muat ulang</button></div>
    {error && <div className="card mb-4 border border-red-500/30 text-red-300 text-sm">{error}</div>}
    {loading ? <div className="card text-center py-12 text-white/50">Memuat lapangan...</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{courts.map(c => {
      const rows = bookings.filter(b => b.courtId === c.id && b.status !== 'cancelled');
      const revenue = rows.filter(b => b.status === 'paid' || b.status === 'checked_in').reduce((sum, b) => sum + b.totalPrice, 0);
      return <div key={c.id} className="card"><div className="flex items-start justify-between mb-4"><div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center"><Dumbbell className={`w-7 h-7 text-brand-400 ${c.sport === 'badminton' ? 'rotate-45' : ''}`}/></div><span className={`px-3 py-1 rounded-lg text-xs font-medium ${c.isActive ? 'bg-brand-500/10 text-brand-400' : 'bg-red-500/10 text-red-400'}`}>{c.isActive ? 'Aktif' : 'Nonaktif'}</span></div>
      <h3 className="font-display font-bold text-white text-lg mb-1">{c.name}</h3><p className="text-brand-400 font-semibold mb-4">{formatRupiah(c.pricePerHour)}/jam</p><div className="flex items-center justify-between pt-4 border-t border-white/10"><div><p className="text-xs text-white/40">Total Booking</p><p className="text-white font-bold">{rows.length}</p></div><div className="text-right"><p className="text-xs text-white/40">Pendapatan Lunas</p><p className="text-brand-400 font-bold">{formatRupiah(revenue)}</p></div></div></div>;
    })}</div>}
  </div>;
}
