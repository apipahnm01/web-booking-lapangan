import { useState } from 'react';
import { Search, Ticket, Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { formatRupiah, formatDate } from '@/lib/store';
import type { Booking } from '@/lib/types';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { supabase } from '@/lib/supabase';

export default function CheckBookingPage() {
  const [token, setToken] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<Booking | null | 'not_found'>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim() || !phone.trim() || !supabase) return;
    setSearched(false);
    setResult(null);
    try {
      const { data, error } = await supabase.rpc('lookup_customer_booking', {
        p_token: token.trim(),
        p_phone: phone.trim(),
      });
      if (error) throw error;
      setResult((data as Booking | null) || 'not_found');
    } catch {
      setResult('not_found');
    } finally {
      setSearched(true);
    }
  }

  function downloadQR(b: Booking) {
    const link = document.createElement('a');
    link.href = document.querySelector<HTMLImageElement>('img[alt="QR Code"]')?.src || '';
    link.download = `QR-${b.token}.png`;
    link.click();
  }

  const statusMap: Record<Booking['status'], { label: string; color: string }> = {
    pending: { label: 'Menunggu Pembayaran', color: 'bg-yellow-500/20 text-yellow-400' },
    paid: { label: 'Lunas', color: 'bg-brand-500/20 text-brand-400' },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-500/20 text-red-400' },
    checked_in: { label: 'Sudah Check-in', color: 'bg-blue-500/20 text-blue-400' },
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-7 h-7 text-brand-400" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-2">Cek Booking</h1>
        <p className="text-white/50">Masukkan kode booking dan nomor HP untuk melihat detail.</p>
      </div>

      <form onSubmit={handleSearch} className="card mb-6">
        <div className="space-y-4">
          <div>
            <label className="label-field">Kode Booking</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              placeholder="BKXXXXXXXX"
              className="input-field font-mono tracking-wider text-center text-lg"
              maxLength={10}
            />
          </div>
          <div>
            <label className="label-field">Nomor HP</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="input-field"
            />
          </div>
          <button type="submit" disabled={!token.trim() || !phone.trim()} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
            <Search className="w-5 h-5" />
            Cek Booking
          </button>
        </div>
      </form>

      {searched && result === 'not_found' && (
        <div className="card text-center animate-scale-in">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-white font-medium">Booking tidak ditemukan</p>
          <p className="text-sm text-white/50 mt-1">Periksa kembali kode booking dan nomor HP Anda.</p>
        </div>
      )}

      {result && result !== 'not_found' && (
        <div className="card animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-white/50">Kode Booking</p>
              <p className="text-2xl font-display font-bold text-brand-400 tracking-wider">{result.token}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusMap[result.status].color}`}>
              {statusMap[result.status].label}
            </span>
          </div>

          <div className="flex justify-center mb-6">
            <QRCodeDisplay value={result.token} size={180} />
          </div>

          <div className="space-y-3 mb-6">
            {[
              { icon: MapPin, label: 'Lapangan', value: result.courtName },
              { icon: Calendar, label: 'Tanggal', value: formatDate(result.date) },
              { icon: Clock, label: 'Jam', value: `${result.startTime} - ${result.endTime}` },
              { icon: User, label: 'Atas Nama', value: result.customerName },
              { icon: Phone, label: 'HP', value: result.customerPhone },
              ...(result.customerEmail ? [{ icon: Mail, label: 'Email', value: result.customerEmail }] : []),
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3 pb-3 border-b border-white/5 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/40">{item.label}</p>
                    <p className="text-white text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between bg-navy-700/50 rounded-xl px-4 py-3 mb-4">
            <span className="text-white/70 text-sm">Total Pembayaran</span>
            <span className="text-brand-400 font-display font-bold text-lg">{formatRupiah(result.totalPrice)}</span>
          </div>

          {result.status === 'paid' && (
            <button onClick={() => downloadQR(result)} className="btn-secondary w-full">
              <Download className="w-5 h-5" />
              Download QR Code
            </button>
          )}
          {result.status === 'checked_in' && (
            <div className="flex items-center gap-2 justify-center text-blue-400 text-sm">
              <CheckCircle2 className="w-5 h-5" />
              Anda sudah check-in. Terima kasih!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
