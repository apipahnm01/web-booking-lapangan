import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Users, CreditCard, CheckSquare, Calendar, TrendingUp, ArrowRight, Circle, ScanLine, FileBarChart, RefreshCw, X, Clock, MapPin, User, Phone } from 'lucide-react';
import { useAdminData } from '@/lib/useAdminData';
import { formatRupiah } from '@/lib/store';
import type { Booking } from '@/lib/types';

const courtImage = (booking: Booking) => {
  if (booking.sport === 'futsal') {
    return 'https://laparaga.s3.ap-southeast-1.amazonaws.com/venue/5fa66e1d5a12e2386dbf287a_thumbnail_original_1686043890341.png';
  }
  if (booking.courtId === 'badminton-3' || booking.courtId === 'badminton-4') {
    return 'https://asset.ayo.co.id/image/venue-field/176792532432539.image_cropper_1767924965379.jpg.jpeg';
  }
  return 'https://asset.ayo.co.id/image/venue/176967625064502.image_cropper_5479706B-E297-4AA9-A45E-E0B9931F6194-1124-0000009CC7422108.jpg.jpeg';
};

const statusLabel: Record<Booking['status'], string> = {
  pending: 'Menunggu Pembayaran',
  paid: 'Lunas',
  cancelled: 'Dibatalkan',
  checked_in: 'Sudah Check-in',
};

export default function AdminDashboardPage() {
  const { bookings, payments, checkIns, customers, courts, loading, error, reload } = useAdminData();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const successfulPayments = payments.filter(p => p.status === 'success');
  const totalRevenue = successfulPayments.reduce((s,p) => s + p.amount, 0);
  const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() - (11 - index));
    const year = date.getFullYear(); const month = date.getMonth();
    const rows = successfulPayments.filter(p => { const paidAt = new Date(p.createdAt); return !Number.isNaN(paidAt.getTime()) && paidAt.getFullYear() === year && paidAt.getMonth() === month; });
    return { label: date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }), count: rows.length, total: rows.reduce((sum, p) => sum + p.amount, 0) };
  });
  const stats = [
    {label:'Total Pendapatan',value:formatRupiah(totalRevenue),icon:TrendingUp,color:'text-brand-400',bg:'bg-brand-500/10'},
    {label:'Total Booking',value:bookings.length,icon:ClipboardList,color:'text-blue-400',bg:'bg-blue-500/10'},
    {label:'Booking Lunas',value:bookings.filter(b=>b.status==='paid').length,icon:CheckSquare,color:'text-green-400',bg:'bg-green-500/10'},
    {label:'Menunggu Bayar',value:bookings.filter(b=>b.status==='pending').length,icon:CreditCard,color:'text-yellow-400',bg:'bg-yellow-500/10'},
    {label:'Check-in',value:checkIns.length,icon:CheckSquare,color:'text-purple-400',bg:'bg-purple-500/10'},
    {label:'Customer',value:customers.length,icon:Users,color:'text-pink-400',bg:'bg-pink-500/10'},
  ];
  const actions = [{to:'/admin/scan',label:'Scan QR Check-in',icon:ScanLine,desc:'Pindai QR customer'},{to:'/admin/booking',label:'Kelola Booking',icon:ClipboardList,desc:'Lihat semua booking'},{to:'/admin/laporan',label:'Laporan & Export',icon:FileBarChart,desc:'Lihat dan ekspor data'},{to:'/admin/jadwal',label:'Lihat Jadwal',icon:Calendar,desc:'Jadwal lapangan'}];
  return <div className="p-6 lg:p-8">
    <div className="flex items-center justify-between mb-8"><div><h1 className="text-2xl font-display font-bold text-white mb-1">Dashboard</h1><p className="text-white/50">Ringkasan langsung dari Supabase.</p></div><button onClick={()=>void reload()} className="btn-secondary" disabled={loading}><RefreshCw className={`w-5 h-5 ${loading?'animate-spin':''}`}/> Muat ulang</button></div>
    {error && <div className="card mb-4 border border-red-500/30 text-red-300 text-sm">{error}</div>}
    {loading ? <div className="card text-center py-12 text-white/50">Memuat data dashboard...</div> : <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">{stats.map((s,i)=>{const Icon=s.icon;return <div key={i} className="card"><div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><Icon className={`w-5 h-5 ${s.color}`}/></div><p className="text-xs text-white/40 mb-1">{s.label}</p><p className="text-lg font-display font-bold text-white">{s.value}</p></div>})}</div>
      <div className="card mb-8"><h2 className="font-display font-bold text-white mb-1">Pendapatan per Bulan</h2><p className="text-xs text-white/40 mb-4">Hanya pembayaran terbayar · 12 bulan terakhir</p><div className="overflow-x-auto"><table className="w-full min-w-[520px]"><thead><tr className="border-b border-white/10"><th className="text-left text-xs text-white/40 uppercase px-3 py-3">Bulan</th><th className="text-right text-xs text-white/40 uppercase px-3 py-3">Jumlah Transaksi</th><th className="text-right text-xs text-white/40 uppercase px-3 py-3">Total Pendapatan</th></tr></thead><tbody>{monthlyRevenue.map(m=><tr key={m.label} className="border-b border-white/5"><td className="px-3 py-3 text-white/80 text-sm capitalize">{m.label}</td><td className="px-3 py-3 text-right text-white/70 text-sm">{m.count}</td><td className="px-3 py-3 text-right text-brand-400 text-sm font-semibold">{formatRupiah(m.total)}</td></tr>)}</tbody></table></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{actions.map((a,i)=>{const Icon=a.icon;return <Link key={i} to={a.to} className="card group hover:border-brand-500/30 transition-all"><div className="flex items-start justify-between mb-3"><div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center"><Icon className="w-5 h-5 text-brand-400"/></div><ArrowRight className="w-5 h-5 text-white/20 group-hover:text-brand-400"/></div><h3 className="font-semibold text-white text-sm mb-1">{a.label}</h3><p className="text-xs text-white/40">{a.desc}</p></Link>})}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4"><div><h2 className="font-display font-bold text-white">Riwayat Aktivitas Pemesanan</h2><p className="text-xs text-white/40 mt-1">Klik salah satu pemesanan untuk melihat foto dan detail lapangan.</p></div><Link to="/admin/booking" className="text-brand-400 text-sm hover:underline whitespace-nowrap">Lihat Semua</Link></div>
          {bookings.slice(0,5).length===0?<p className="text-white/40 text-sm text-center py-8">Belum ada booking.</p>:<div className="space-y-2">{bookings.slice(0,5).map(b=><button type="button" key={b.id} onClick={()=>setSelectedBooking(b)} className="w-full text-left flex items-center gap-3 pb-3 border-b border-white/5 last:border-0 rounded-lg hover:bg-white/5 px-2 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"><div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center shrink-0"><Circle className="w-5 h-5 text-brand-400"/></div><div className="flex-1 min-w-0"><p className="text-white text-sm font-medium truncate">{b.customerName} - {b.courtName}</p><p className="text-white/40 text-xs">{b.date} {b.startTime}-{b.endTime} · {statusLabel[b.status]}</p></div><span className="text-brand-400 text-sm font-medium whitespace-nowrap">{formatRupiah(b.totalPrice)}</span><ArrowRight className="w-4 h-4 text-white/30 shrink-0"/></button>)}</div>}
        </div>
        <div className="card"><h2 className="font-display font-bold text-white mb-4">Status Lapangan</h2><div className="space-y-3">{courts.map(c=>{const count=bookings.filter(b=>b.courtId===c.id&&b.status!=='cancelled').length;return <div key={c.id} className="flex items-center justify-between pb-3 border-b border-white/5 last:border-0"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center"><Circle className="w-4 h-4 text-brand-400"/></div><div><p className="text-white text-sm font-medium">{c.name}</p><p className="text-white/40 text-xs capitalize">{c.sport} · {formatRupiah(c.pricePerHour)}/jam</p></div></div><span className="text-white/60 text-sm">{count} booking</span></div>})}</div></div>
      </div>
    </>}
    {selectedBooking && <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={()=>setSelectedBooking(null)}>
      <section role="dialog" aria-modal="true" aria-labelledby="booking-detail-title" className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-navy-800 shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10"><div><p className="text-xs text-white/40">Detail Riwayat Pemesanan</p><h2 id="booking-detail-title" className="text-lg font-display font-bold text-white">{selectedBooking.courtName}</h2></div><button type="button" onClick={()=>setSelectedBooking(null)} aria-label="Tutup detail" className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70"><X className="w-5 h-5"/></button></div>
        <div className="p-5">
          <div className="h-52 sm:h-60 overflow-hidden rounded-xl border border-white/10 mb-5 bg-navy-700"><img src={courtImage(selectedBooking)} alt={`Foto ${selectedBooking.courtName}`} className="w-full h-full object-cover" /></div>
          <div className="flex items-center justify-between gap-3 mb-4"><span className="font-mono text-brand-400 font-semibold">{selectedBooking.token}</span><span className="text-xs px-3 py-1.5 rounded-full bg-brand-500/15 text-brand-300">{statusLabel[selectedBooking.status]}</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-white/40 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Lapangan</p><p className="text-sm text-white font-medium">{selectedBooking.courtName}</p></div>
            <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-white/40 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Tanggal</p><p className="text-sm text-white font-medium">{selectedBooking.date}</p></div>
            <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-white/40 mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Waktu</p><p className="text-sm text-white font-medium">{selectedBooking.startTime} - {selectedBooking.endTime}</p></div>
            <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-white/40 mb-1 flex items-center gap-1"><User className="w-3 h-3"/> Pemesan</p><p className="text-sm text-white font-medium">{selectedBooking.customerName}</p></div>
            <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-white/40 mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Nomor HP</p><p className="text-sm text-white font-medium">{selectedBooking.customerPhone}</p></div>
            <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-white/40 mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3"/> Pembayaran</p><p className="text-sm text-white font-medium">{selectedBooking.paymentMethod || '-'}</p></div>
          </div>
          <div className="mt-4 rounded-xl bg-brand-500/10 border border-brand-500/20 p-4 flex items-center justify-between"><span className="text-sm text-white/70">Total Pembayaran</span><strong className="text-lg text-brand-400">{formatRupiah(selectedBooking.totalPrice)}</strong></div>
        </div>
      </section>
    </div>}
  </div>;
}
