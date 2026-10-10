import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Dumbbell, Calendar, Clock, ChevronRight, ChevronLeft, Check, X, User, Phone, Mail, CreditCard, Loader2 } from 'lucide-react';
import { COURTS, TIME_SLOTS, PAYMENT_METHODS } from '@/lib/constants';
import { getBookedSlots, createBooking, createPayment, updateBookingStatus, calculatePrice, formatRupiah, formatDate } from '@/lib/store';
import type { SportType, Booking } from '@/lib/types';
import QRCodeDisplay from '@/components/QRCodeDisplay';

type Step = 'sport' | 'court' | 'datetime' | 'details' | 'payment' | 'result';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('sport');
  const [sport, setSport] = useState<SportType | null>(null);
  const [courtId, setCourtId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [processing, setProcessing] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const s = searchParams.get('sport');
    if (s === 'futsal' || s === 'badminton') {
      setSport(s);
      setStep('court');
    }
  }, [searchParams]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const filteredCourts = useMemo(() => {
    if (!sport) return [];
    return COURTS.filter(c => c.sport === sport);
  }, [sport]);

  const bookedSlots = useMemo(() => {
    if (!courtId || !date) return [];
    return getBookedSlots(courtId, date);
  }, [courtId, date]);

  const selectedCourt = useMemo(() => COURTS.find(c => c.id === courtId), [courtId]);
  const totalPrice = useMemo(() => calculatePrice(courtId, duration), [courtId, duration]);

  const steps: { key: Step; label: string }[] = [
    { key: 'sport', label: 'Jenis' },
    { key: 'court', label: 'Lapangan' },
    { key: 'datetime', label: 'Waktu' },
    { key: 'details', label: 'Data' },
    { key: 'payment', label: 'Bayar' },
  ];
  const currentStepIdx = steps.findIndex(s => s.key === step);

  function handleProcessPayment() {
    if (!selectedCourt || !sport) return;
    setProcessing(true);
    setError('');
    setTimeout(() => {
      try {
        const endTimeSlot = TIME_SLOTS[TIME_SLOTS.indexOf(startTime) + duration];
        const newBooking = createBooking({
          courtId,
          courtName: selectedCourt.name,
          sport,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          date,
          startTime,
          endTime: endTimeSlot,
          duration,
          totalPrice,
          paymentMethod,
        });
        createPayment({
          bookingId: newBooking.id,
          bookingToken: newBooking.token,
          amount: totalPrice,
          method: paymentMethod,
        });
        updateBookingStatus(newBooking.id, 'paid');
        setBooking({ ...newBooking, status: 'paid' });
        setStep('result');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      }
      setProcessing(false);
    }, 1500);
  }

  function resetBooking() {
    setStep('sport');
    setSport(null);
    setCourtId('');
    setDate('');
    setStartTime('');
    setDuration(1);
    setName('');
    setPhone('');
    setEmail('');
    setPaymentMethod('qris');
    setBooking(null);
    navigate('/booking');
  }

  // Result step
  if (step === 'result' && booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="card text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Booking Berhasil!</h2>
          <p className="text-white/50 mb-6">Simpan kode booking & QR Code berikut untuk check-in.</p>

          <div className="bg-navy-700/50 rounded-xl p-6 mb-6">
            <p className="text-sm text-white/50 mb-1">Kode Booking</p>
            <p className="text-3xl font-display font-bold text-brand-400 tracking-wider mb-4">{booking.token}</p>
            <div className="flex justify-center mb-4">
              <QRCodeDisplay value={booking.token} size={220} />
            </div>
          </div>

          <div className="text-left space-y-2 mb-6">
            {[
              { label: 'Lapangan', value: booking.courtName },
              { label: 'Tanggal', value: formatDate(booking.date) },
              { label: 'Jam', value: `${booking.startTime} - ${booking.endTime}` },
              { label: 'Atas Nama', value: booking.customerName },
              { label: 'Total', value: formatRupiah(booking.totalPrice) },
            ].map((item, i) => (
              <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50 text-sm">{item.label}</span>
                <span className="text-white font-medium text-sm text-right">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={resetBooking} className="btn-primary flex-1">
              <Calendar className="w-5 h-5" />
              Booking Lagi
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary flex-1">
              Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i <= currentStepIdx ? 'bg-brand-500 text-white' : 'bg-navy-700 text-white/30'
                }`}
              >
                {i < currentStepIdx ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i <= currentStepIdx ? 'text-white' : 'text-white/30'}`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 rounded ${i < currentStepIdx ? 'bg-brand-500' : 'bg-navy-700'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step: Sport */}
      {step === 'sport' && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-display font-bold text-white mb-2">Pilih Jenis Olahraga</h2>
          <p className="text-white/50 mb-6">Pilih jenis lapangan yang ingin kamu booking.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(['futsal', 'badminton'] as SportType[]).map(s => (
              <button
                key={s}
                onClick={() => { setSport(s); setCourtId(''); setStep('court'); }}
                className="card text-left hover:border-brand-500/40 transition-all hover:scale-[1.02] cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
                  <Dumbbell className={`w-7 h-7 text-brand-400 ${s === 'badminton' ? 'rotate-45' : ''}`} />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-1 capitalize">{s}</h3>
                <p className="text-sm text-white/50 mb-2">
                  {s === 'futsal' ? '1 lapangan tersedia' : '4 lapangan tersedia'}
                </p>
                <p className="text-brand-400 font-semibold text-sm">
                  Mulai {formatRupiah(s === 'futsal' ? 150000 : 50000)}/jam
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Court */}
      {step === 'court' && sport && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-display font-bold text-white mb-2">Pilih Lapangan {sport === 'futsal' ? 'Futsal' : 'Badminton'}</h2>
          <p className="text-white/50 mb-6">Pilih lapangan yang tersedia.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCourts.map(c => (
              <button
                key={c.id}
                onClick={() => { setCourtId(c.id); setStep('datetime'); }}
                className={`card text-left hover:border-brand-500/40 transition-all hover:scale-[1.02] cursor-pointer ${
                  courtId === c.id ? 'border-brand-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <Dumbbell className={`w-6 h-6 text-brand-400 ${c.sport === 'badminton' ? 'rotate-45' : ''}`} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30" />
                </div>
                <h3 className="font-display font-bold text-white">{c.name}</h3>
                <p className="text-brand-400 font-semibold mt-1">{formatRupiah(c.pricePerHour)}/jam</p>
              </button>
            ))}
          </div>
          <button onClick={() => setStep('sport')} className="btn-secondary mt-6">
            <ChevronLeft className="w-5 h-5" /> Kembali
          </button>
        </div>
      )}

      {/* Step: DateTime */}
      {step === 'datetime' && selectedCourt && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-display font-bold text-white mb-2">Pilih Tanggal & Jam</h2>
          <p className="text-white/50 mb-6">{selectedCourt.name} - {formatRupiah(selectedCourt.pricePerHour)}/jam</p>

          <div className="mb-6">
            <label className="label-field">Tanggal</label>
            <input
              type="date"
              min={todayStr}
              value={date}
              onChange={(e) => { setDate(e.target.value); setStartTime(''); }}
              className="input-field"
            />
          </div>

          {date && (
            <>
              <div className="mb-6">
                <label className="label-field">Durasi</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map(d => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                        duration === d ? 'bg-brand-500 text-white' : 'bg-navy-700 text-white/60 hover:bg-navy-600'
                      }`}
                    >
                      {d} Jam
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="label-field">Jam Mulai</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.slice(0, TIME_SLOTS.length - duration + 1).map(slot => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = startTime === slot;
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setStartTime(slot)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                          isBooked
                            ? 'bg-navy-700/50 text-white/20 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-brand-500 text-white'
                            : 'bg-navy-700 text-white/70 hover:bg-navy-600'
                        }`}
                      >
                        {isBooked && <X className="w-3 h-3" />}
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {startTime && (
                <div className="card mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">Total Bayar</p>
                      <p className="text-2xl font-display font-bold text-brand-400">{formatRupiah(totalPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/50">{formatDate(date)}</p>
                      <p className="text-white font-medium">{startTime} - {TIME_SLOTS[TIME_SLOTS.indexOf(startTime) + duration]}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep('court')} className="btn-secondary">
                  <ChevronLeft className="w-5 h-5" /> Kembali
                </button>
                <button
                  disabled={!startTime}
                  onClick={() => setStep('details')}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Lanjut <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step: Details */}
      {step === 'details' && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-display font-bold text-white mb-2">Data Pemesan</h2>
          <p className="text-white/50 mb-6">Isi data diri untuk booking.</p>

          <div className="space-y-4">
            <div>
              <label className="label-field">Nama Lengkap *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="input-field pl-11"
                />
              </div>
            </div>
            <div>
              <label className="label-field">Nomor HP *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="input-field pl-11"
                />
              </div>
            </div>
            <div>
              <label className="label-field">Email (opsional)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="input-field pl-11"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep('datetime')} className="btn-secondary">
              <ChevronLeft className="w-5 h-5" /> Kembali
            </button>
            <button
              disabled={!name.trim() || !phone.trim()}
              onClick={() => setStep('payment')}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Lanjut <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step: Payment */}
      {step === 'payment' && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-display font-bold text-white mb-2">Pembayaran</h2>
          <p className="text-white/50 mb-6">Pilih metode pembayaran (simulasi).</p>

          <div className="card mb-6">
            <h3 className="font-semibold text-white mb-4">Detail Booking</h3>
            <div className="space-y-2">
              {[
                { label: 'Lapangan', value: selectedCourt?.name || '' },
                { label: 'Tanggal', value: formatDate(date) },
                { label: 'Jam', value: `${startTime} - ${TIME_SLOTS[TIME_SLOTS.indexOf(startTime) + duration]}` },
                { label: 'Durasi', value: `${duration} jam` },
                { label: 'Nama', value: name },
                { label: 'HP', value: phone },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/50">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                <span className="text-white font-semibold">Total</span>
                <span className="text-brand-400 font-display font-bold text-lg">{formatRupiah(totalPrice)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {PAYMENT_METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all border ${
                  paymentMethod === m.id
                    ? 'bg-brand-500/10 border-brand-500'
                    : 'bg-navy-700 border-white/10 hover:bg-navy-600'
                }`}
              >
                <CreditCard className={`w-5 h-5 ${paymentMethod === m.id ? 'text-brand-400' : 'text-white/40'}`} />
                <span className={`font-medium ${paymentMethod === m.id ? 'text-white' : 'text-white/60'}`}>{m.label}</span>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === m.id ? 'border-brand-500' : 'border-white/20'
                }`}>
                  {paymentMethod === m.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep('details')} className="btn-secondary">
              <ChevronLeft className="w-5 h-5" /> Kembali
            </button>
            <button
              disabled={processing}
              onClick={handleProcessPayment}
              className="btn-primary disabled:opacity-50 flex-1"
            >
              {processing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
              ) : (
                <><CreditCard className="w-5 h-5" /> Bayar {formatRupiah(totalPrice)}</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
