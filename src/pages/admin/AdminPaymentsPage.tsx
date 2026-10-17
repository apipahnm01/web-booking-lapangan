import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatRupiah, exportToCSV } from '@/lib/store';
import { CreditCard, Download, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

type PaymentRow = {
  id: string;
  booking_id: string;
  booking_token: string;
  amount: number;
  method: string;
  status: 'success' | 'failed' | 'pending';
  created_at: string;
};

const statusIcon = { success: CheckCircle2, failed: XCircle, pending: Clock };
const statusColor = {
  success: 'bg-brand-500/20 text-brand-400',
  failed: 'bg-red-500/20 text-red-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
};
const statusLabel = { success: 'Terbayar', failed: 'Gagal', pending: 'Menunggu konfirmasi' };

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/payments', { credentials: 'same-origin' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Data pembayaran gagal dimuat.');
      setPayments((result.data ?? []) as PaymentRow[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Data pembayaran gagal dimuat.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadPayments(); }, [loadPayments]);

  const totalRevenue = useMemo(
    () => payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );
  const successful = payments.filter(p => p.status === 'success').length;
  const failed = payments.filter(p => p.status === 'failed').length;
  const pending = payments.filter(p => p.status === 'pending').length;

  async function confirmPayment(payment: PaymentRow) {
    if (busyId) return;
    const approved = confirm(
      'Pastikan pembayaran untuk booking ' + payment.booking_token + ' benar-benar sudah diterima. Konfirmasi sebagai TERBAYAR?'
    );
    if (!approved) return;

    setBusyId(payment.id);
    let confirmError = '';
    try {
      const response = await fetch('/api/admin/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ booking_id: payment.booking_id }),
      });
      const result = await response.json();
      if (!response.ok) confirmError = result.error || 'Terjadi kesalahan.';
    } catch {
      confirmError = 'Tidak dapat terhubung ke server.';
    }
    setBusyId('');
    if (confirmError) {
      alert('Pembayaran belum berhasil dikonfirmasi: ' + confirmError);
      return;
    }
    await loadPayments();
    alert('Pembayaran berhasil dikonfirmasi. Status booking menjadi Lunas.');
  }

  function handleExport() {
    exportToCSV(
      'payments.csv',
      ['Kode Booking', 'Jumlah', 'Metode', 'Status', 'Tanggal'],
      payments.map(p => [p.booking_token, p.amount, p.method, statusLabel[p.status], p.created_at])
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Pembayaran</h1>
          <p className="text-white/50">Transaksi tersimpan di Supabase. Konfirmasi hanya setelah uang diterima.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void loadPayments()} className="btn-secondary" disabled={loading}>
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /> Muat ulang
          </button>
          <button onClick={handleExport} className="btn-secondary" disabled={!payments.length}>
            <Download className="w-5 h-5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Pendapatan', value: formatRupiah(totalRevenue), color: 'text-brand-400' },
          { label: 'Terbayar', value: successful, color: 'text-green-400' },
          { label: 'Gagal', value: failed, color: 'text-red-400' },
          { label: 'Menunggu Konfirmasi', value: pending, color: 'text-yellow-400' },
        ].map((item, index) => (
          <div key={index} className="card">
            <p className="text-xs text-white/40 mb-1">{item.label}</p>
            <p className={`text-lg font-display font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {error && <div className="card mb-4 border border-red-500/30 text-red-300 text-sm">{error}</div>}
      {loading ? (
        <div className="card text-center py-12 text-white/50">Memuat pembayaran dari Supabase...</div>
      ) : payments.length === 0 ? (
        <div className="card text-center py-12">
          <CreditCard className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">{error ? 'Data pembayaran belum dapat dimuat.' : 'Belum ada transaksi.'}</p>
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
                <th className="text-center text-xs font-medium text-white/40 uppercase px-4 py-3">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => {
                const Icon = statusIcon[payment.status];
                return (
                  <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-brand-400 text-sm">{payment.booking_token}</td>
                    <td className="px-4 py-3 text-white/70 text-sm capitalize">{payment.method}</td>
                    <td className="px-4 py-3 text-right text-white font-medium text-sm">{formatRupiah(payment.amount)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${statusColor[payment.status]}`}>
                        <Icon className="w-3 h-3" />
                        {statusLabel[payment.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-sm">
                      {new Date(payment.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {payment.status === 'pending' ? (
                        <button
                          onClick={() => void confirmPayment(payment)}
                          disabled={Boolean(busyId)}
                          className="btn-primary text-xs whitespace-nowrap"
                        >
                          {busyId === payment.id ? 'Memproses...' : 'Konfirmasi terbayar'}
                        </button>
                      ) : (
                        <span className="text-white/30 text-xs">—</span>
                      )}
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
