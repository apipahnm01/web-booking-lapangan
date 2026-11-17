import { Link } from 'react-router-dom';
import { usePublicCourts } from '@/lib/usePublicCourts';
import { Dumbbell, Calendar, QrCode, ShieldCheck, Clock, MapPin, ArrowRight, Search, CheckCircle2 } from 'lucide-react';

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

export default function HomePage() {
  const courts = usePublicCourts();
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
              Lihat pilihan lapangan, tentukan jadwal, lalu pesan dengan mudah. Dapatkan kode booking & QR Code untuk check-in di lokasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#daftar-lapangan" className="btn-primary text-lg px-8 py-4">
                <Calendar className="w-5 h-5" />
                Lihat Lapangan
                <ArrowRight className="w-5 h-5" />
              </a>
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

      {/* Individual court list */}
      <section id="daftar-lapangan" className="max-w-5xl mx-auto px-4 py-16 scroll-mt-24">
        <div className="text-center mb-10">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-2">Pilihan Lapangan</p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
            Lihat Masing-Masing Lapangan
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Setiap lapangan ditampilkan secara terpisah. Pilih lapangan yang ingin digunakan untuk melihat jadwal dan melanjutkan booking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courts.map((court, index) => (
            <article
              key={court.id}
              className="card group flex flex-col border border-white/10 hover:border-brand-500/50 transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="relative h-44 overflow-hidden rounded-xl border border-white/10 mb-5">
                <img
                  src={court.sport === 'futsal'
                    ? 'https://laparaga.s3.ap-southeast-1.amazonaws.com/venue/5fa66e1d5a12e2386dbf287a_thumbnail_original_1686043890341.png'
                    : court.id === 'badminton-3'
                      ? 'https://asset.ayo.co.id/image/venue/176967625064502.image_cropper_5479706B-E297-4AA9-A45E-E0B9931F6194-1124-0000009CC7422108.jpg.jpeg'
                      : court.id === 'badminton-4'
                        ? 'https://asset.ayo.co.id/image/venue-field/176792532432539.image_cropper_1767924965379.jpg.jpeg'
                        : 'https://asset.ayo.co.id/image/venue/176967625064502.image_cropper_5479706B-E297-4AA9-A45E-E0B9931F6194-1124-0000009CC7422108.jpg.jpeg'}
                  alt={`Foto lapangan ${court.name}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/40 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1">
                  {court.sport === 'futsal' ? 'Futsal' : 'Badminton'}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  <span className="text-xs text-white/45">Pilihan lapangan</span>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{court.name}</h3>
                <p className="text-sm text-white/50 mb-5">Lapangan {court.sport} yang siap digunakan.</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4 mb-5">
                  <span className="text-sm text-white/45">Harga per jam</span>
                  <span className="text-brand-400 font-bold">{formatPrice(court.pricePerHour)}</span>
                </div>
              </div>

              <Link
                to={`/booking?sport=${court.sport}&court=${court.id}`}
                className="btn-primary w-full justify-center"
              >
                Pilih Lapangan
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white text-center mb-12">
          Cara Booking
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Pilih Lapangan', desc: 'Lihat setiap lapangan dan pilih salah satu' },
            { step: '2', title: 'Pilih Tanggal & Jam', desc: 'Slot tersedia 08:00 - 22:00' },
            { step: '3', title: 'Bayar', desc: 'Pilih metode pembayaran' },
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
