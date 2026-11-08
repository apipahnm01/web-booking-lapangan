import { Link } from 'react-router-dom';
import { Dumbbell, Calendar, QrCode, ShieldCheck, Clock, MapPin, ArrowUpRight, Search, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[640px] flex items-center border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_45%,rgba(167,124,79,.19),transparent_42%),linear-gradient(115deg,#100b08_0%,#1b130f_54%,#2b201a_100%)]" />
        <div className="absolute right-[-8rem] top-10 h-[32rem] w-[32rem] rounded-full border border-brand-300/15" />
        <div className="absolute right-[-3rem] top-24 h-[22rem] w-[22rem] rounded-full border border-brand-300/10" />
        <div className="absolute right-[8%] top-[22%] hidden lg:block h-72 w-56 rotate-6 border border-brand-200/20 bg-gradient-to-br from-brand-300/10 via-white/[0.02] to-transparent shadow-2xl shadow-black/40">
          <div className="absolute inset-3 border border-brand-200/15" />
          <div className="absolute inset-x-7 top-10 bottom-10 flex flex-col items-center justify-center text-center">
            <Dumbbell className="w-12 h-12 text-brand-200/70 mb-5" strokeWidth={1} />
            <span className="font-display text-5xl italic text-brand-100/80 leading-none">Play</span>
            <span className="editorial-kicker mt-4">Move with purpose</span>
          </div>
        </div>
        <div className="relative max-w-7xl w-full mx-auto px-5 sm:px-8 py-24 md:py-32">
          <div className="max-w-3xl animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-10 bg-brand-300" />
              <p className="editorial-kicker">Sportbooking · Futsal & Badminton</p>
            </div>
            <h1 className="editorial-title text-[4.3rem] sm:text-7xl md:text-8xl lg:text-[7.5rem] text-[#f5eee4]">
              Make room<br />for <span className="italic text-brand-300">your game.</span>
            </h1>
            <div className="mt-9 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end max-w-3xl">
              <p className="max-w-md text-sm sm:text-base leading-7 text-white/55">
                Temukan waktu bermain, pilih lapangan favorit, dan amankan jadwalmu. Semua proses booking dalam satu tempat.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/booking" className="btn-primary">Booking sekarang <ArrowUpRight className="w-4 h-4" /></Link>
                <Link to="/cek-booking" className="btn-secondary">Cek booking <Search className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-5 border-t border-white/15 flex flex-wrap gap-x-10 gap-y-3 text-[10px] uppercase tracking-[.22em] text-white/35">
            <span>01 / Pilih lapangan</span><span>02 / Tentukan waktu</span><span>03 / Konfirmasi booking</span><span>04 / Scan QR saat datang</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div><p className="editorial-kicker mb-3">Find your court</p><h2 className="editorial-title text-5xl md:text-6xl text-[#f5eee4]">Choose your <span className="italic text-brand-300">arena.</span></h2></div>
          <p className="max-w-sm text-sm leading-6 text-white/45">Pilih jenis olahraga dan temukan lapangan yang sesuai dengan permainanmu.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link to="/booking?sport=futsal" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#33251b] to-[#17100c] p-7 md:p-9 min-h-72 transition-all hover:border-brand-300/50">
            <div className="absolute right-7 top-7 text-brand-200/20 group-hover:text-brand-200/40 transition-colors"><Dumbbell className="w-24 h-24" strokeWidth={.7}/></div>
            <p className="editorial-kicker">01 · Team sport</p><h3 className="font-display text-5xl md:text-6xl text-[#f5eee4] mt-8 mb-3">Futsal</h3>
            <p className="text-sm text-white/45 max-w-xs">Lapangan futsal untuk pertandingan dan sesi latihan bersama tim.</p>
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/45"><span className="flex items-center gap-2"><Clock className="w-4 h-4"/> 08:00 – 22:00</span><span className="text-brand-300 font-semibold">Mulai Rp 150.000/jam</span></div>
            <ArrowUpRight className="absolute bottom-7 right-7 w-5 h-5 text-white/35 group-hover:text-brand-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"/>
          </Link>
          <Link to="/booking?sport=badminton" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#302820] to-[#17100c] p-7 md:p-9 min-h-72 transition-all hover:border-brand-300/50">
            <div className="absolute right-7 top-7 text-brand-200/20 group-hover:text-brand-200/40 transition-colors"><Dumbbell className="w-24 h-24 rotate-45" strokeWidth={.7}/></div>
            <p className="editorial-kicker">02 · Racket sport</p><h3 className="font-display text-5xl md:text-6xl text-[#f5eee4] mt-8 mb-3">Badminton</h3>
            <p className="text-sm text-white/45 max-w-xs">Empat pilihan lapangan untuk permainan santai maupun kompetitif.</p>
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/45"><span className="flex items-center gap-2"><Clock className="w-4 h-4"/> 08:00 – 22:00</span><span className="text-brand-300 font-semibold">Mulai Rp 50.000/jam</span></div>
            <ArrowUpRight className="absolute bottom-7 right-7 w-5 h-5 text-white/35 group-hover:text-brand-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"/>
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="grid md:grid-cols-[.8fr_1.2fr] gap-12">
            <div><p className="editorial-kicker mb-3">Simple by design</p><h2 className="editorial-title text-5xl md:text-6xl text-[#f5eee4]">The game<br/><span className="italic text-brand-300">starts here.</span></h2></div>
            <div className="grid sm:grid-cols-3 gap-7">
              {[{icon:Calendar,title:'Booking 24/7',desc:'Pesan lapangan kapan saja tanpa perlu datang ke lokasi.'},{icon:QrCode,title:'QR check-in',desc:'Tunjukkan QR Code di lokasi untuk proses check-in.'},{icon:ShieldCheck,title:'Jadwal terjaga',desc:'Sistem membantu mencegah pemesanan ganda pada slot yang sama.'}].map((f,i)=>{const Icon=f.icon;return <div key={i} className="border-t border-brand-300/35 pt-5"><Icon className="w-6 h-6 text-brand-300 mb-5" strokeWidth={1.4}/><h3 className="font-display text-2xl text-white mb-2">{f.title}</h3><p className="text-sm leading-6 text-white/40">{f.desc}</p></div>})}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div><p className="editorial-kicker mb-2">Ready when you are</p><h2 className="font-display text-4xl md:text-5xl text-[#f5eee4]">Your next match is one click away.</h2></div>
        <Link to="/booking" className="btn-primary shrink-0">Mulai booking <ArrowRight className="w-4 h-4"/></Link>
      </section>
    </div>
  );
}