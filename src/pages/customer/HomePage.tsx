import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePublicCourts } from '@/lib/usePublicCourts';
import { CalendarDays, Clock3, Search, ArrowRight, ShieldCheck, QrCode, History, CreditCard, Settings, Trophy, Dumbbell, CheckCircle2 } from 'lucide-react';

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

export default function HomePage() {
  const courts = usePublicCourts();
  const navigate = useNavigate();
  const [sport, setSport] = useState('futsal');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  function searchCourts() {
    const params = new URLSearchParams({ sport });
    if (date) params.set('date', date);
    if (time) params.set('time', time);
    navigate(`/booking?${params.toString()}`);
  }

  const features = [
    { icon: CalendarDays, title: 'Booking Mudah & Cepat', desc: 'Pilih lapangan dan jadwal tanpa harus datang langsung.' },
    { icon: Dumbbell, title: 'Futsal & Badminton', desc: 'Temukan lapangan sesuai olahraga favoritmu.' },
    { icon: QrCode, title: 'QR Code Booking', desc: 'Kode booking tersedia setelah pemesanan berhasil.' },
    { icon: History, title: 'Riwayat Pemesanan', desc: 'Cek kembali detail dan status booking kamu.' },
    { icon: ShieldCheck, title: 'Pemesanan Teratur', desc: 'Jadwal yang sudah terisi tidak bisa dipesan ganda.' },
    { icon: Settings, title: 'Dashboard Admin', desc: 'Pengelolaan lapangan dan booking lebih praktis.' },
  ];

  return (
    <div className="court-landing bg-[#f3f8ff] text-[#14264a]">
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 -right-24 h-[34rem] w-[34rem] rounded-full bg-[#d8ebff] blur-2xl" />
        <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#e4f2ff] blur-2xl" />
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 md:px-10 md:pb-14 md:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                <Trophy className="h-4 w-4" /> Futsal <span className="text-blue-300">•</span> Badminton
              </div>
              <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-[#14264a] md:text-6xl xl:text-7xl">
                Find Your Game.<br /><span className="text-[#1765e8]">Book Your Court.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Booking lapangan futsal dan badminton jadi lebih mudah, cepat, dan praktis. Pilih jadwal bermainmu dan pesan langsung dari sini.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#daftar-lapangan" className="inline-flex items-center gap-3 rounded-full bg-[#1765e8] px-7 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700">
                  Jelajahi Lapangan <ArrowRight className="h-5 w-5" />
                </a>
                <Link to="/cek-booking" className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-7 py-4 font-semibold text-[#18315d] shadow-sm transition hover:bg-blue-50">
                  Cek Booking
                </Link>
              </div>
            </div>
            <div className="relative min-h-[320px] md:min-h-[430px]">
              <div className="absolute inset-3 rotate-[-3deg] rounded-[2.5rem] bg-gradient-to-br from-[#c5e2ff] via-[#e8f4ff] to-[#9fcaff] shadow-xl shadow-blue-100" />
              <img
                src="https://laparaga.s3.ap-southeast-1.amazonaws.com/venue/5fa66e1d5a12e2386dbf287a_thumbnail_original_1686043890341.png"
                alt="Lapangan olahraga"
                className="absolute inset-0 h-full w-full rounded-[2.2rem] object-cover shadow-2xl shadow-blue-200/70"
              />
              <div className="absolute inset-0 rounded-[2.2rem] bg-gradient-to-t from-[#0c2858]/45 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 rounded-2xl border border-white/60 bg-white/90 px-5 py-4 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><CalendarDays className="h-6 w-6" /></div>
                  <div><p className="text-sm text-slate-500">Waktunya bermain</p><p className="font-bold text-[#14264a]">Pilih jadwal favoritmu</p></div>
                </div>
              </div>
              <div className="absolute right-5 top-5 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-700"><CheckCircle2 className="h-4 w-4" /> Booking praktis</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 rounded-[1.8rem] border border-white bg-white/95 p-4 shadow-[0_18px_55px_rgba(38,104,180,0.13)] md:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
              <label className="flex items-center gap-3 rounded-2xl bg-[#f4f8ff] px-4 py-3">
                <Dumbbell className="h-6 w-6 shrink-0 text-[#1765e8]" />
                <span className="min-w-0 flex-1"><span className="block text-xs font-medium text-slate-500">Jenis Olahraga</span>
                  <select value={sport} onChange={e => setSport(e.target.value)} className="mt-1 w-full bg-transparent font-bold text-[#14264a] outline-none">
                    <option value="futsal">Futsal</option><option value="badminton">Badminton</option>
                  </select>
                </span>
              </label>
              <label className="flex items-center gap-3 rounded-2xl bg-[#f4f8ff] px-4 py-3">
                <CalendarDays className="h-6 w-6 shrink-0 text-[#1765e8]" />
                <span className="min-w-0 flex-1"><span className="block text-xs font-medium text-slate-500">Tanggal</span>
                  <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full bg-transparent font-semibold text-[#14264a] outline-none" />
                </span>
              </label>
              <label className="flex items-center gap-3 rounded-2xl bg-[#f4f8ff] px-4 py-3">
                <Clock3 className="h-6 w-6 shrink-0 text-[#1765e8]" />
                <span className="min-w-0 flex-1"><span className="block text-xs font-medium text-slate-500">Jam Bermain</span>
                  <select value={time} onChange={e => setTime(e.target.value)} className="mt-1 w-full bg-transparent font-bold text-[#14264a] outline-none">
                    <option value="">Pilih Jam</option>
                    {Array.from({ length: 15 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`).map(slot => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </span>
              </label>
              <button onClick={searchCourts} className="inline-flex min-h-[62px] items-center justify-center gap-3 rounded-2xl bg-[#1765e8] px-7 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
                <Search className="h-5 w-5" /> Cari Lapangan
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        <div className="mb-8 text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Lebih praktis</p><h2 className="mt-2 text-3xl font-extrabold text-[#14264a] md:text-4xl">Semua kebutuhan bermain dalam satu tempat</h2></div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {features.map(({ icon: Icon, title, desc }) => <article key={title} className="rounded-3xl border border-blue-50 bg-white p-5 text-center shadow-[0_8px_30px_rgba(38,104,180,0.07)] transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f2ff] text-[#1765e8]"><Icon className="h-7 w-7" /></div>
            <h3 className="font-extrabold text-[#14264a]">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
          </article>)}
        </div>
      </section>

      <section id="daftar-lapangan" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12 md:px-10 md:py-16">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Pilihan Lapangan</p><h2 className="mt-2 text-3xl font-extrabold text-[#14264a] md:text-4xl">Temukan tempat bermainmu</h2><p className="mt-2 text-slate-500">Pilih lapangan dan lanjutkan pemesanan dengan mudah.</p></div>
          <Link to="/booking" className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900">Booking sekarang <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courts.map(court => <article key={court.id} className="overflow-hidden rounded-3xl border border-blue-50 bg-white shadow-[0_10px_35px_rgba(38,104,180,0.08)] transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-48 overflow-hidden bg-blue-100"><img src={court.sport === 'futsal' ? 'https://laparaga.s3.ap-southeast-1.amazonaws.com/venue/5fa66e1d5a12e2386dbf287a_thumbnail_original_1686043890341.png' : 'https://asset.ayo.co.id/image/venue-field/176792532432539.image_cropper_1767924965379.jpg.jpeg'} alt={`Lapangan ${court.name}`} className="h-full w-full object-cover transition duration-500 hover:scale-105" loading="lazy" /><span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold capitalize text-blue-700 shadow">{court.sport}</span></div>
            <div className="p-5"><div className="flex items-center gap-2 text-xs font-semibold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Siap dipesan</div><h3 className="mt-2 text-xl font-extrabold text-[#14264a]">{court.name}</h3><div className="mt-4 flex items-center justify-between border-t border-blue-50 pt-4"><span className="text-sm text-slate-500">Harga per jam</span><span className="font-extrabold text-blue-700">{formatPrice(court.pricePerHour)}</span></div><Link to={`/booking?sport=${court.sport}&court=${court.id}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1765e8] px-5 py-3 font-bold text-white transition hover:bg-blue-700">Pilih Lapangan <ArrowRight className="h-4 w-4" /></Link></div>
          </article>)}
        </div>
      </section>

      <section id="cara-booking" className="border-y border-blue-100 bg-white/70">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-10"><div className="mb-9 text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Cara Booking</p><h2 className="mt-2 text-3xl font-extrabold text-[#14264a]">Tiga langkah menuju pertandinganmu</h2></div><div className="grid gap-6 md:grid-cols-3">{[{n:'01',t:'Pilih lapangan',d:'Tentukan olahraga dan lapangan yang ingin digunakan.'},{n:'02',t:'Atur jadwal',d:'Pilih tanggal serta jam bermain yang masih tersedia.'},{n:'03',t:'Selesaikan booking',d:'Isi data pemesan dan simpan QR Code booking.'}].map(item=><div key={item.n} className="rounded-3xl border border-blue-100 bg-white p-6"><span className="text-3xl font-black text-blue-200">{item.n}</span><h3 className="mt-3 text-xl font-extrabold text-[#14264a]">{item.t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{item.d}</p></div>)}</div></div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 text-center md:px-10"><h2 className="text-2xl font-extrabold text-[#14264a] md:text-3xl">Siap mulai bermain?</h2><p className="mt-2 text-slate-500">Cari lapangan yang cocok dan amankan jadwalmu sekarang.</p><a href="#daftar-lapangan" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1765e8] px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700">Lihat Lapangan <ArrowRight className="h-4 w-4" /></a></section>
    </div>
  );
}
