import { useMemo } from 'react';
import { getPayments, formatRupiah, exportToCSV } from '@/lib/store';
import { CreditCard, Download, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AdminPaymentsPage() {
  const payments = useMemo(() => getPayments(), []);

  const totalRevenue = payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);
  const successful = payments.filter(p => p.status === 'success').length;
  const failed = payments.filter(p => p.status === 'failed').length;
  const pending = payments.filter(p => p.status === 'pending').length;

  function handleExport() {
    exportToCSV(
      'payments.csv',
      ['Kode Booking', 'Jumlah', 'Metode', 'Status', 'Tanggal'],
      payments.map(p => [p.bookingToken, p.amount, p.method, p.status, p.createdAt])
    );
  }

  const statusIcon = { success: CheckCircle2, failed: XCircle, pending: Clock };
  const statusColor = {
    success: 'bg-brand-500/20 text-brand-400',
    failed: 'bg-red-500/20 text-red-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Pembayaran</h1>
          <p className="text-white/50">Riwayat semua transaksi.</p>
        </div>
        <button onClick={handleExport} className="btn-secondary">
          <Download className="w-5 h-5" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Pendapatan', value: formatRupiah(totalRevenue), color: 'text-brand-400' },
          { label: 'Sukses', value: successful, color: 'text-green-400' },
          { label: 'Gagal', value: failed, color: 'text-red-400' },
          { label: 'Pending', value: pending, color: 'text-yellow-400' },
        ].map((s, i) => (
          <div key={i} className="card">
            <p className="text-xs text-white/40 mb-1">{s.label}</p>
            <p className={`text-lg font-display font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {payments.length === 0 ? (
        <div className="card text-center py-12">
          <CreditCard className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">Belum ada transaksi.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs font-medium text-white/40 uppercase px-4 py-3">Kode Booking</th>
                <th className="text-left text-xs font-medium text-white/40 uppercase px-4 py-3">Metode</th>
                <th className="text-right text-xs font-medium text-white/40 uppercase px-4 py-3">Jumlah</th>
                <th className="text-center text-xs font-medium text-white/40 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-white/40 uppercase px-4 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const Icon = statusIcon[p.status];
                return (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-brand-400 text-sm">{p.bookingToken}</td>
                    <td className="px-4 py-3 text-white/70 text-sm capitalize">{p.method}</td>
                    <td className="px-4 py-3 text-right text-white font-medium text-sm">{formatRupiah(p.amount)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${statusColor[p.status]}`}>
                        <Icon className="w-3 h-3" />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-sm">
                      {new Date(p.createdAt).toLocaleString('id-ID')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
