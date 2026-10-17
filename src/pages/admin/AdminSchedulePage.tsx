import { useMemo, useState } from 'react';
import { TIME_SLOTS } from '@/lib/constants';
import { useAdminData } from '@/lib/useAdminData';
import { Calendar, Clock, X, Check, Circle, RefreshCw } from 'lucide-react';

export default function AdminSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const { courts, bookings, loading, error, reload } = useAdminData();
  const [selectedCourtId, setSelectedCourtId] = useState('');
  const courtId = selectedCourtId || courts[0]?.id || '';
  const bookedSlots = useMemo(() => {
    const busy = new Set<string>();
    bookings.filter(b => b.courtId === courtId && b.date === selectedDate && ['pending','paid','checked_in'].includes(b.status)).forEach(b => {
      const start = TIME_SLOTS.indexOf(b.startTime.slice(0,5));
      for (let i = 0; i < b.duration; i++) if (start >= 0 && TIME_SLOTS[start+i]) busy.add(TIME_SLOTS[start+i]);
    });
    return [...busy];
  }, [bookings, courtId, selectedDate]);
  return <div className="p-6 lg:p-8">
    <div className="flex items-center justify-between mb-8"><div><h1 className="text-2xl font-display font-bold text-white mb-1">Jadwal Lapangan</h1><p className="text-white/50">Jadwal berdasarkan booking yang tersimpan di database.</p></div><button onClick={() => void reload()} className="btn-secondary" disabled={loading}><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}/> Muat ulang</button></div>
    {error && <div className="card mb-4 border border-red-500/30 text-red-300 text-sm">{error}</div>}
    <div className="card mb-6"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="label-field"><Calendar className="w-4 h-4 inline mr-1"/> Tanggal</label><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="input-field"/></div><div><label className="label-field"><Circle className="w-4 h-4 inline mr-1"/> Lapangan</label><select value={courtId} onChange={e => setSelectedCourtId(e.target.value)} className="input-field">{courts.map(c => <option key={c.id} value={c.id} className="bg-navy-700">{c.name}</option>)}</select></div></div></div>
    {loading ? <div className="card text-center py-12 text-white/50">Memuat jadwal...</div> : <div className="card"><div className="flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text-brand-400"/><h2 className="font-display font-bold text-white">Slot {courts.find(c => c.id === courtId)?.name}</h2></div><div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">{TIME_SLOTS.map(slot => { const busy = bookedSlots.includes(slot); return <div key={slot} className={`rounded-xl px-3 py-3 text-center text-sm font-medium border ${busy ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-brand-500/10 border-brand-500/20 text-brand-400'}`}><div className="flex items-center justify-center gap-1.5">{busy ? <X className="w-3.5 h-3.5"/> : <Check className="w-3.5 h-3.5"/>}{slot}</div><p className="text-xs mt-1 opacity-60">{busy ? 'Terisi' : 'Kosong'}</p></div>; })}</div></div>}
  </div>;
}
