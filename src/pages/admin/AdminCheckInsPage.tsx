import { useAdminData } from '@/lib/useAdminData';
import { exportToCSV, formatDate } from '@/lib/store';
import { CheckSquare, Download, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminCheckInsPage() {
  const { checkIns, loading, error, reload } = useAdminData();
  function handleExport() {
    exportToCSV('checkins.csv', ['Kode Booking', 'Customer', 'Lapangan', 'Tanggal Main', 'Jam', 'Check-in Pada'],
      checkIns.map(c => [c.bookingToken, c.customerName, c.courtName, c.date, `${c.startTime}-${c.endTime}`, c.checkedInAt]));
  }
  return <div className="p-6 lg:p-8">
    <div className="flex items-center justify-between mb-8">
      <div><h1 className="text-2xl font-display font-bold text-white mb-1">Check-in</h1><p className="text-white/50">Riwayat check-in langsung dari database.</p></div>
      <div className="flex gap-2"><button onClick={() => void reload()} className="btn-secondary" disabled={loading}><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /> Muat ulang</button><button onClick={handleExport} className="btn-secondary" disabled={!checkIns.length}><Download className="w-5 h-5" /> Export CSV</button></div>
    </div>
    {error && <div className="card mb-4 border border-red-500/30 text-red-300 text-sm">{error}</div>}
    {loading ? <div className="card text-center py-12 text-white/50">Memuat riwayat check-in...</div> : checkIns.length === 0 ? <div className="card text-center py-12"><CheckSquare className="w-12 h-12 text-white/20 mx-auto mb-3"/><p className="text-white/40">Belum ada check-in.</p></div> :
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{checkIns.map(c => <div key={c.id} className="card">
      <div className="flex items-center justify-between mb-3"><span className="font-mono text-brand-400 text-sm">{c.bookingToken}</span><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400"><CheckCircle2 className="w-3 h-3"/> Check-in</span></div>
      <p className="text-white font-medium">{c.customerName}</p><p className="text-white/50 text-sm">{c.courtName}</p><p className="text-white/40 text-sm mt-2">{formatDate(c.date)}</p><p className="text-white/70 text-sm">{c.startTime} - {c.endTime}</p><p className="text-xs text-white/30 mt-3 pt-3 border-t border-white/10">Check-in: {new Date(c.checkedInAt).toLocaleString('id-ID')}</p>
    </div>)}</div>}
  </div>;
}
