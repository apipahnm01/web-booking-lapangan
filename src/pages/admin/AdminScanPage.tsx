import { useState } from 'react';
import QRScanner from '@/components/QRScanner';
import { getBookingByToken, createCheckIn, formatRupiah, formatDate } from '@/lib/store';
import type { Booking } from '@/lib/types';
import { ScanLine, CheckCircle2, XCircle, User, MapPin, Calendar, Clock, RotateCcw } from 'lucide-react';

export default function AdminScanPage() {
  const [result, setResult] = useState<{ type: 'success' | 'error' | 'info'; booking?: Booking; message: string } | null>(null);

  function handleScan(token: string) {
    const booking = getBookingByToken(token.trim());
    if (!booking) {
      setResult({ type: 'error', message: `Booking dengan token "${token}" tidak ditemukan.` });
      return;
    }
    if (booking.status === 'cancelled') {
      setResult({ type: 'error', booking, message: 'Booking ini telah dibatalkan.' });
      return;
    }
    if (booking.status === 'checked_in') {
      setResult({ type: 'error', booking, message: 'QR ini sudah pernah digunakan untuk check-in.' });
      return;
    }
    if (booking.status === 'pending') {
      setResult({ type: 'error', booking, message: 'Booking belum dibayar. Tidak bisa check-in.' });
      return;
    }

    const checkin = createCheckIn(booking);
    if ('error' in checkin) {
      setResult({ type: 'error', booking, message: checkin.error });
    } else {
      setResult({ type: 'success', booking, message: 'Check-in berhasil!' });
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1">Scan QR Code</h1>
        <p className="text-white/50">Pindai QR Code customer untuk check-in.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {result ? (
          <div className="animate-scale-in">
            <div className={`card border-2 ${
              result.type === 'success' ? 'border-brand-500/40' :
              result.type === 'error' ? 'border-red-500/40' : 'border-blue-500/40'
            }`}>
              <div className="text-center mb-6">
                {result.type === 'success' ? (
                  <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8 text-brand-400" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                    <XCircle className="w-8 h-8 text-red-400" />
                  </div>
                )}
                <h2 className={`text-xl font-display font-bold ${
                  result.type === 'success' ? 'text-brand-400' : 'text-red-400'
                }`}>
                  {result.message}
                </h2>
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
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-white/40" />
                        </div>
                        <span className="text-white/50 text-sm w-20">{item.label}</span>
                        <span className="text-white text-sm font-medium">{item.value}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-white/50 text-sm">Total Bayar</span>
                    <span className="text-brand-400 font-bold">{formatRupiah(result.booking.totalPrice)}</span>
                  </div>
                </div>
              )}

              <button onClick={() => setResult(null)} className="btn-primary w-full">
                <RotateCcw className="w-5 h-5" />
                Scan Lagi
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-3 mb-6">
              <ScanLine className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <p className="text-brand-400 text-sm">Arahkan kamera ke QR Code pada tiket booking customer.</p>
            </div>
            <QRScanner onScan={handleScan} />
          </>
        )}
      </div>
    </div>
  );
}
