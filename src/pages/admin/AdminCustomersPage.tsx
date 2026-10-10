import { useMemo } from 'react';
import { getCustomers, formatRupiah } from '@/lib/store';
import { Users, Download, Phone, Mail } from 'lucide-react';
import { exportToCSV } from '@/lib/store';

export default function AdminCustomersPage() {
  const customers = useMemo(() => getCustomers(), []);

  function handleExport() {
    exportToCSV(
      'customers.csv',
      ['Nama', 'HP', 'Email', 'Total Booking', 'Total Belanja'],
      customers.map(c => [c.name, c.phone, c.email, c.bookings, c.totalSpent])
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Customer</h1>
          <p className="text-white/50">Daftar semua customer.</p>
        </div>
        <button onClick={handleExport} className="btn-secondary">
          <Download className="w-5 h-5" /> Export CSV
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">Belum ada customer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c, i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-400 font-display font-bold text-lg">
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{c.name}</p>
                  <p className="text-white/40 text-xs flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {c.phone}
                  </p>
                </div>
              </div>
              {c.email && (
                <p className="text-white/40 text-xs flex items-center gap-1 mb-3">
                  <Mail className="w-3 h-3" /> {c.email}
                </p>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div>
                  <p className="text-xs text-white/40">Booking</p>
                  <p className="text-white font-bold">{c.bookings}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">Total Belanja</p>
                  <p className="text-brand-400 font-bold">{formatRupiah(c.totalSpent)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
