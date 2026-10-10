import { useState, useMemo } from 'react';
import { COURTS, TIME_SLOTS } from '@/lib/constants';
import { getBookedSlots } from '@/lib/store';
import { Calendar, Clock, X, Check, Circle } from 'lucide-react';

export default function AdminSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedCourtId, setSelectedCourtId] = useState(COURTS[0].id);

  const bookedSlots = useMemo(() => {
    return getBookedSlots(selectedCourtId, selectedDate);
  }, [selectedCourtId, selectedDate]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1">Jadwal Lapangan</h1>
        <p className="text-white/50">Lihat ketersediaan slot per lapangan.</p>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">
              <Calendar className="w-4 h-4 inline mr-1" /> Tanggal
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">
              <Circle className="w-4 h-4 inline mr-1" /> Lapangan
            </label>
            <select
              value={selectedCourtId}
              onChange={(e) => setSelectedCourtId(e.target.value)}
              className="input-field"
            >
              {COURTS.map(c => (
                <option key={c.id} value={c.id} className="bg-navy-700">{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-brand-400" />
          <h2 className="font-display font-bold text-white">
            Slot {COURTS.find(c => c.id === selectedCourtId)?.name}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {TIME_SLOTS.map(slot => {
            const isBooked = bookedSlots.includes(slot);
            return (
              <div
                key={slot}
                className={`rounded-xl px-3 py-3 text-center text-sm font-medium border transition-all ${
                  isBooked
                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : 'bg-brand-500/10 border-brand-500/20 text-brand-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  {isBooked ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                  {slot}
                </div>
                <p className="text-xs mt-1 opacity-60">{isBooked ? 'Terisi' : 'Kosong'}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
