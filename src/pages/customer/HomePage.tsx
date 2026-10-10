import { Link } from 'react-router-dom';
import { Dumbbell, Calendar, QrCode, ShieldCheck, Clock, MapPin, ArrowRight, Search } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              Booking Mudah, Aman, & Cepat
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white leading-tight mb-4">
              Booking Lapangan <span className="text-brand-400">Futsal</span> &amp; <span className="text-brand-400">Badminton</span>
            </h1>
            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              Pesan lapangan favoritmu kapan saja, dapatkan kode booking & QR Code untuk check-in langsung di lokasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/booking" className="btn-primary text-lg px-8 py-4">
                <Calendar className="w-5 h-5" />
                Booking Sekarang
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/cek-booking" className="btn-secondary text-lg px-8 py-4">
                <Search className="w-5 h-5" />
                Cek Booking
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white text-center mb-12">
          Kenapa Pilih Kami?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Calendar, title: 'Booking 24/7', desc: 'Pesan lapangan kapan saja tanpa perlu datang ke lokasi.' },
            { icon: QrCode, title: 'QR Code Check-in', desc: 'Tunjukkan QR Code di lokasi untuk check-in yang cepat.' },
            { icon: ShieldCheck, title: 'Anti Double Booking', desc: 'Sistem mencegah pemesanan ganda pada jam yang sama.' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="card text-center hover:border-brand-500/30 transition-colors animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-brand-400" />
                </div>
                <h3 className="font-display font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Court types */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white text-center mb-12">
          Pilih Jenis Lapangan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/booking?sport=futsal"
            className="card group hover:border-brand-500/40 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-brand-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-white/30 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-1">Futsal</h3>
            <p className="text-sm text-white/50 mb-3">Lapangan futsal berkualitas, cocok untuk tim kamu.</p>
            <div className="flex items-center gap-4 text-sm text-white/40">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> 1 Lapangan</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 08:00 - 22:00</span>
            </div>
            <p className="mt-4 text-brand-400 font-semibold">Mulai Rp 150.000/jam</p>
          </Link>

          <Link
            to="/booking?sport=badminton"
            className="card group hover:border-brand-500/40 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-brand-400 rotate-45" />
              </div>
              <ArrowRight className="w-6 h-6 text-white/30 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-1">Badminton</h3>
            <p className="text-sm text-white/50 mb-3">4 lapangan badminton standar internasional.</p>
            <div className="flex items-center gap-4 text-sm text-white/40">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> 4 Lapangan</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 08:00 - 22:00</span>
            </div>
            <p className="mt-4 text-brand-400 font-semibold">Mulai Rp 50.000/jam</p>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white text-center mb-12">
          Cara Booking
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Pilih Lapangan', desc: 'Futsal atau Badminton' },
            { step: '2', title: 'Pilih Tanggal & Jam', desc: 'Slot tersedia 08:00 - 22:00' },
            { step: '3', title: 'Bayar', desc: 'Pembayaran simulasi cepat' },
            { step: '4', title: 'Dapat QR Code', desc: 'Tunjukkan di lokasi' },
          ].map((s, i) => (
            <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-12 h-12 rounded-full bg-brand-500 text-white font-display font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold text-white mb-1">{s.title}</h3>
              <p className="text-sm text-white/40">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
