import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePublicCourts } from '@/lib/usePublicCourts';
import ThemeToggle from '@/components/ThemeToggle';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Dumbbell, History, QrCode, Search, ShieldCheck, Trophy, Users } from 'lucide-react';

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

  const benefits = [
    { icon: CalendarDays, title: 'Jadwal lebih mudah', desc: 'Pilih waktu bermain tanpa perlu datang langsung.' },
    { icon: QrCode, title: 'QR Code digital', desc: 'Simpan bukti booking setelah pesanan berhasil.' },
    { icon: ShieldCheck, title: 'Slot lebih teratur', desc: 'Lihat ketersediaan jadwal sebelum memesan.' },
    { icon: History, title: 'Riwayat tersimpan', desc: 'Temukan kembali detail pemesanan kapan saja.' },
  ];

  return (
    <div className="home-page min-h-screen overflow-hidden bg-[#f5f5f3] text-[#171717] dark:bg-[#101114] dark:text-white">
      <section className="mx-auto max-w-[1500px] px-3 pb-7 pt-4 sm:px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[26px] border border-black/[0.06] bg-white shadow-[0_18px_70px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#191a1e]">
          <div className="relative z-20 flex min-h-[68px] items-center justify-between gap-4 border-b border-black/[0.05] px-5 sm:px-8">
            <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-[-0.06em] sm:text-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black"><Dumbbell className="h-4 w-4" /></span>
              Sport<span className="font-semibold">Futsal</span>
            </Link>
            <nav className="hidden items-center gap-7 text-[13px] font-medium text-neutral-600 dark:text-neutral-300 md:flex">
              <a href="#home" className="text-black dark:text-white">Home</a>
              <a href="#courts" className="transition hover:text-black dark:hover:text-white">Lapangan</a>
              <a href="#how" className="transition hover:text-black dark:hover:text-white">Cara Booking</a>
              <Link to="/cek-booking" className="transition hover:text-black dark:hover:text-white">Cek Booking</Link>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/login" className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold transition hover:border-black hover:bg-black hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-black sm:px-5 sm:text-sm">Login</Link>
              <Link to="/booking" className="hidden rounded-full bg-black px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200 sm:inline-flex sm:text-sm">Booking Sekarang</Link>
            </div>
          </div>

          <div id="home" className="relative isolate min-h-[540px] overflow-hidden px-5 pb-10 pt-16 text-center sm:px-10 sm:pt-20 lg:min-h-[590px]">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full opacity-[0.12] dark:opacity-[0.08]">
              <svg viewBox="0 0 1440 620" preserveAspectRatio="none" className="h-full w-full">
                <defs><pattern id="courtDots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" fill="currentColor" /></pattern></defs>
                <path d="M0 390 C180 290 260 470 440 420 S710 285 870 380 1110 480 1260 335 1380 300 1440 350 L1440 620 L0 620Z" fill="url(#courtDots)" />
                <path d="M0 440 C180 340 260 520 440 470 S710 335 870 430 1110 530 1260 385 1380 350 1440 400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 5" />
              </svg>
            </div>
            <div className="mx-auto max-w-4xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.19em] text-neutral-600 shadow-sm dark:border-white/10 dark:bg-[#222328] dark:text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Sport venue booking platform
              </div>
              <h1 className="mx-auto max-w-4xl text-[42px] font-light leading-[1.06] tracking-[-0.065em] text-neutral-500 sm:text-6xl lg:text-[76px]">
                Make time for the game.
                <span className="block font-black text-[#171717] dark:text-white">Own your court.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:text-base">
                Temukan lapangan futsal dan badminton, pilih jadwal yang tersedia, lalu booking dengan praktis dalam satu tempat.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a href="#courts" className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200">Explore Courts <ArrowRight className="h-4 w-4" /></a>
                <Link to="/cek-booking" className="rounded-full border border-neutral-300 bg-white/80 px-7 py-3.5 text-sm font-semibold transition hover:border-black dark:border-white/20 dark:bg-transparent dark:hover:border-white">Cek Booking</Link>
              </div>
            </div>

            <div className="pointer-events-none absolute left-[5%] top-[48%] hidden -rotate-6 overflow-hidden rounded-2xl border-[5px] border-white bg-white shadow-2xl shadow-black/15 md:block lg:left-[9%]">
              <img src="https://asset.ayo.co.id/image/venue-field/176792532432539.image_cropper_1767924965379.jpg.jpeg" alt="Lapangan badminton" className="h-28 w-40 object-cover lg:h-32 lg:w-48" />
              <div className="px-3 py-2 text-left text-[10px] font-bold tracking-wide text-neutral-700">BADMINTON COURT</div>
            </div>
            <div className="pointer-events-none absolute right-[5%] top-[43%] hidden rotate-6 overflow-hidden rounded-2xl border-[5px] border-white bg-white shadow-2xl shadow-black/15 md:block lg:right-[9%]">
              <img src="https://laparaga.s3.ap-southeast-1.amazonaws.com/venue/5fa66e1d5a12e2386dbf287a_thumbnail_original_1686043890341.png" alt="Lapangan futsal" className="h-28 w-40 object-cover lg:h-32 lg:w-48" />
              <div className="px-3 py-2 text-left text-[10px] font-bold tracking-wide text-neutral-700">FUTSAL ARENA</div>
            </div>
            <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-400 sm:flex"><span className="h-px w-12 bg-neutral-300" /> Scroll to discover <span className="h-px w-12 bg-neutral-300" /></div>
          </div>

          <div className="relative z-10 mx-4 mb-5 rounded-2xl border border-neutral-200 bg-white p-3 shadow-[0_14px_40px_rgba(0,0,0,0.07)] sm:mx-8 sm:p-4 dark:border-white/10 dark:bg-[#222328]">
            <div className="grid gap-3 md:grid-cols-[1.1fr_1fr_1fr_auto] md:items-center">
              <label className="flex items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3 dark:bg-[#191a1e]"><Dumbbell className="h-5 w-5 shrink-0 text-neutral-500" /><span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Olahraga</span><select value={sport} onChange={e => setSport(e.target.value)} className="mt-1 w-full bg-transparent text-sm font-bold outline-none"><option value="futsal">Futsal</option><option value="badminton">Badminton</option></select></span></label>
              <label className="flex items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3 dark:bg-[#191a1e]"><CalendarDays className="h-5 w-5 shrink-0 text-neutral-500" /><span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Tanggal bermain</span><input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full bg-transparent text-sm font-semibold outline-none" /></span></label>
              <label className="flex items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3 dark:bg-[#191a1e]"><Clock3 className="h-5 w-5 shrink-0 text-neutral-500" /><span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Jam bermain</span><select value={time} onChange={e => setTime(e.target.value)} className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"><option value="">Pilih jam</option>{Array.from({ length: 15 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`).map(slot => <option key={slot} value={slot}>{slot}</option>)}</select></span></label>
              <button onClick={searchCourts} className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-xl bg-black px-7 text-sm font-bold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200"><Search className="h-4 w-4" /> Cari</button>
            </div>
          </div>
        </div>
      </section>

      <section id="courts" className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-400">Find your place</p><h2 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Choose your court.</h2><p className="mt-2 text-sm text-neutral-500">Pilih arena yang cocok untuk pertandingan berikutnya.</p></div>
          <Link to="/booking" className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-xs font-bold transition hover:border-black hover:bg-black hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-black">Semua lapangan <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courts.map(court => <article key={court.id} className="group overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_8px_35px_rgba(0,0,0,0.035)] transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#191a1e]">
            <div className="relative h-52 overflow-hidden bg-neutral-100"><img src={court.sport === 'futsal' ? 'https://laparaga.s3.ap-southeast-1.amazonaws.com/venue/5fa66e1d5a12e2386dbf287a_thumbnail_original_1686043890341.png' : 'https://asset.ayo.co.id/image/venue-field/176792532432539.image_cropper_1767924965379.jpg.jpeg'} alt={`Lapangan ${court.name}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /><span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800">{court.sport}</span></div>
            <div className="p-5"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Tersedia untuk booking</div><h3 className="mt-2 text-xl font-extrabold tracking-tight">{court.name}</h3><div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-white/10"><span className="text-xs text-neutral-500">Harga per jam</span><span className="font-extrabold">{formatPrice(court.pricePerHour)}</span></div><Link to={`/booking?sport=${court.sport}&court=${court.id}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-bold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200">Pilih lapangan <ArrowRight className="h-4 w-4" /></Link></div>
          </article>)}
          {courts.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center text-sm text-neutral-500 dark:border-white/20 dark:bg-[#191a1e]">Daftar lapangan akan muncul di sini setelah data tersedia.</div>}
        </div>
      </section>

      <section id="how" className="border-y border-black/[0.06] bg-white dark:border-white/10 dark:bg-[#191a1e]">
        <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 lg:py-16">
          <div className="mb-9 max-w-xl"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-400">Simple by design</p><h2 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">From search to game day.</h2></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{benefits.map(({ icon: Icon, title, desc }, index) => <article key={title} className="rounded-2xl border border-neutral-100 bg-[#fafaf9] p-6 dark:border-white/10 dark:bg-[#222328]"><div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-neutral-800 shadow-sm dark:bg-[#191a1e] dark:text-white"><Icon className="h-5 w-5" /></div><span className="text-2xl font-light tracking-tight text-neutral-300">0{index + 1}</span></div><h3 className="mt-6 font-extrabold">{title}</h3><p className="mt-2 text-xs leading-6 text-neutral-500">{desc}</p></article>)}</div>
        </div>
      </section>
      <section className="mx-auto flex max-w-[1500px] flex-col items-center px-5 py-16 text-center sm:px-8"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black"><Trophy className="h-5 w-5" /></div><h2 className="text-3xl font-black tracking-[-0.05em] sm:text-4xl">Your next game starts here.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">Pilih lapangan, tentukan waktu, dan ajak tim kamu bermain.</p><Link to="/booking" className="mt-7 inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200">Mulai booking <ArrowRight className="h-4 w-4" /></Link></section>
    </div>
  );
}
