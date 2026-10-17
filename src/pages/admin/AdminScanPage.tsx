import { useState } from 'react';
import QRScanner from '@/components/QRScanner';
import { formatRupiah, formatDate } from '@/lib/store';
import type { Booking } from '@/lib/types';
import { ScanLine, CheckCircle2, XCircle, User, MapPin, Calendar, Clock, RotateCcw, Keyboard } from 'lucide-react';

export default function AdminScanPage() {
  const [result, setResult] = useState<{ type: 'success' | 'error'; booking?: Booking; message: string } | null>(null);
  const [manualToken, setManualToken] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleScan(rawToken: string) {
    const token = rawToken.trim();
    if (!token || submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setResult({ type: 'error', message: payload.error || 'QR tidak dapat diproses.' });
        return;
      }
      setResult({ type: 'success', booking: payload.booking, message: payload.message || 'Check-in berhasil!' });
      setManualToken('');
    } catch {
      setResult({ type: 'error', message: 'Tidak bisa terhubung ke server. Periksa koneksi internet lalu coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1">Scan QR Code</h1>
        <p className="text-white/50">Pindai QR customer yang sudah lunas untuk check-in.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {result ? (
          <div className="animate-scale-in">
            <div className={`card border-2 ${result.type === 'success' ? 'border-brand-500/40' : 'border-red-500/40'}`}>
              <div className="text-center mb-6">
                {result.type === 'success' ? (
                  <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-3"><CheckCircle2 className="w-8 h-8 text-brand-400" /></div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3"><XCircle className="w-8 h-8 text-red-400" /></div>
                )}
                <h2 className={`text-xl font-display font-bold ${result.type === 'success' ? 'text-brand-400' : 'text-red-400'}`}>{result.message}</h2>
              </div>
              {result.booking && (
                <div className="space-y-3 bg-navy-700/50 rounded-xl p-4 mb-6">
                  {[
                    { icon: User, label: 'Customer', value: result.booking.customerName },
                    { icon: MapPin, label: 'Lapangan', value: result.booking.courtName },
                    { icon: Calendar, label: 'Tanggal', value: formatDate(result.booking.date) },
                    { icon: Clock, label: 'Jam', value: `${result.booking.startTime} - ${result.booking.endTime}` },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return <div key={i} className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-white/40" /></div><span className="text-white/50 text-sm w-20">{item.label}</span><span className="text-white text-sm font-medium">{item.value}</span></div>;
                  })}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10"><span className="text-white/50 text-sm">Total Bayar</span><span className="text-brand-400 font-bold">{formatRupiah(result.booking.totalPrice)}</span></div>
                </div>
              )}
              <button onClick={() => setResult(null)} className="btn-primary w-full"><RotateCcw className="w-5 h-5" /> Scan Lagi</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-3 mb-6">
              <ScanLine className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <p className="text-brand-400 text-sm">Arahkan kamera ke QR pada tiket. Jika kamera tidak bisa digunakan, masukkan kode booking secara manual di bawah.</p>
            </div>
            <QRScanner onScan={handleScan} />
            <form className="card mt-5" onSubmit={(e) => { e.preventDefault(); void handleScan(manualToken); }}>
              <label className="flex items-center gap-2 text-sm font-medium text-white mb-3"><Keyboard className="w-4 h-4" /> Masukkan kode booking manual</label>
              <div className="flex gap-2">
                <input value={manualToken} onChange={(e) => setManualToken(e.target.value.toUpperCase())} placeholder="Contoh: BKXXXXXXXX" className="input-field font-mono flex-1 min-w-0" />
                <button type="submit" disabled={!manualToken.trim() || submitting} className="btn-primary disabled:opacity-50">{submitting ? 'Memproses...' : 'Check-in'}</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
