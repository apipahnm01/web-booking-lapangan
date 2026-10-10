import { COURTS } from '@/lib/constants';
import { formatRupiah } from '@/lib/store';
import { getBookings } from '@/lib/store';
import { useMemo } from 'react';
import { Dumbbell, Circle } from 'lucide-react';

export default function AdminCourtsPage() {
  const bookings = useMemo(() => getBookings(), []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1">Lapangan</h1>
        <p className="text-white/50">Daftar semua lapangan tersedia.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COURTS.map(c => {
          const courtBookings = bookings.filter(b => b.courtId === c.id && b.status !== 'cancelled');
          const revenue = courtBookings.reduce((sum, b) => sum + b.totalPrice, 0);
          return (
            <div key={c.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                  <Dumbbell className={`w-7 h-7 text-brand-400 ${c.sport === 'badminton' ? 'rotate-45' : ''}`} />
                </div>
                <span className="px-3 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-medium capitalize">
                  {c.sport}
                </span>
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-1">{c.name}</h3>
              <p className="text-brand-400 font-semibold mb-4">{formatRupiah(c.pricePerHour)}/jam</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-white/40">Total Booking</p>
                  <p className="text-white font-bold">{courtBookings.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">Pendapatan</p>
                  <p className="text-brand-400 font-bold">{formatRupiah(revenue)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
