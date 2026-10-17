import { useState } from 'react';
import { useAdminData } from '@/lib/useAdminData';
import { formatRupiah, exportToCSV } from '@/lib/store';
import { FileBarChart, Download, TrendingUp, ClipboardList, Users, CheckSquare, Circle, RefreshCw } from 'lucide-react';

type ReportType = 'bookings'|'payments'|'checkins'|'customers';
export default function AdminReportsPage() {
  const { bookings, payments, checkIns, customers, courts, loading, error, reload } = useAdminData();
  const [reportType,setReportType] = useState<ReportType>('bookings');
  const revenue=payments.filter(p=>p.status==='success').reduce((s,p)=>s+p.amount,0);
  const paid=bookings.filter(b=>b.status==='paid'||b.status==='checked_in');
  const revenueByCourt=courts.map(c=>{const rows=paid.filter(b=>b.courtId===c.id);return {name:c.name,count:rows.length,revenue:rows.reduce((s,b)=>s+b.totalPrice,0)};});
  function handleExport(){
    if(reportType==='bookings') exportToCSV('laporan-booking.csv',['Kode','Customer','HP','Lapangan','Tanggal','Jam','Durasi','Total','Status','Metode'],bookings.map(b=>[b.token,b.customerName,b.customerPhone,b.courtName,b.date,`${b.startTime}-${b.endTime}`,`${b.duration} jam`,b.totalPrice,b.status,b.paymentMethod]));
    else if(reportType==='payments') exportToCSV('laporan-pembayaran.csv',['Kode Booking','Jumlah','Metode','Status','Tanggal'],payments.map(p=>[p.bookingToken,p.amount,p.method,p.status,p.createdAt]));
    else if(reportType==='checkins') exportToCSV('laporan-checkin.csv',['Kode Booking','Customer','Lapangan','Tanggal','Jam','Check-in Pada'],checkIns.map(c=>[c.bookingToken,c.customerName,c.courtName,c.date,`${c.startTime}-${c.endTime}`,c.checkedInAt]));
    else exportToCSV('laporan-customer.csv',['Nama','HP','Email','Total Booking','Total Belanja'],customers.map(c=>[c.name,c.phone,c.email,c.bookings,c.totalSpent]));
  }
  function handleExportAll(){exportToCSV('laporan-ringkasan.csv',['Metrik','Nilai'],[['Total Pendapatan',revenue],['Total Booking',bookings.length],['Booking Lunas',paid.length],['Total Check-in',checkIns.length],['Total Customer',customers.length],...revenueByCourt.map(r=>[`Pendapatan ${r.name}`,r.revenue])]);}
  const types:{key:ReportType;label:string;icon:typeof ClipboardList}[]=[{key:'bookings',label:'Booking',icon:ClipboardList},{key:'payments',label:'Pembayaran',icon:TrendingUp},{key:'checkins',label:'Check-in',icon:CheckSquare},{key:'customers',label:'Customer',icon:Users}];
  return <div className="p-6 lg:p-8"><div className="flex items-center justify-between mb-8 flex-wrap gap-4"><div><h1 className="text-2xl font-display font-bold text-white mb-1">Laporan</h1><p className="text-white/50">Laporan dan ekspor data database.</p></div><div className="flex gap-2"><button onClick={()=>void reload()} className="btn-secondary" disabled={loading}><RefreshCw className={`w-5 h-5 ${loading?'animate-spin':''}`}/> Muat ulang</button><button onClick={handleExportAll} className="btn-secondary"><Download className="w-5 h-5"/> Ringkasan CSV</button><button onClick={handleExport} className="btn-primary"><Download className="w-5 h-5"/> Export {types.find(t=>t.key===reportType)?.label}</button></div></div>
    {error&&<div className="card mb-4 border border-red-500/30 text-red-300 text-sm">{error}</div>}
    {loading?<div className="card text-center py-12 text-white/50">Memuat laporan...</div>:<>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{[{label:'Total Pendapatan',value:formatRupiah(revenue),icon:TrendingUp},{label:'Total Booking',value:bookings.length,icon:ClipboardList},{label:'Check-in',value:checkIns.length,icon:CheckSquare},{label:'Customer',value:customers.length,icon:Users}].map((s,i)=>{const Icon=s.icon;return <div key={i} className="card"><div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-3"><Icon className="w-5 h-5 text-brand-400"/></div><p className="text-xs text-white/40 mb-1">{s.label}</p><p className="text-lg font-display font-bold text-white">{s.value}</p></div>})}</div>
      <div className="card mb-8"><h2 className="font-display font-bold text-white mb-4">Pendapatan per Lapangan</h2><div className="space-y-3">{revenueByCourt.map(r=>{const max=Math.max(...revenueByCourt.map(x=>x.revenue),1);return <div key={r.name}><div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><Circle className="w-4 h-4 text-brand-400"/><span className="text-white text-sm font-medium">{r.name}</span><span className="text-white/30 text-xs">({r.count} booking)</span></div><span className="text-brand-400 font-medium text-sm">{formatRupiah(r.revenue)}</span></div><div className="h-2 bg-navy-700 rounded-full overflow-hidden"><div className="h-full bg-brand-500 rounded-full" style={{width:`${r.revenue/max*100}%`}}/></div></div>})}</div></div>
      <div className="card"><h2 className="font-display font-bold text-white mb-4">Pilih Laporan untuk Export</h2><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{types.map(t=>{const Icon=t.icon;return <button key={t.key} onClick={()=>setReportType(t.key)} className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${reportType===t.key?'bg-brand-500 text-white border-brand-500':'bg-navy-700 text-white/60 border-white/10 hover:bg-navy-600'}`}><Icon className="w-4 h-4"/>{t.label}</button>})}</div><div className="mt-4 flex items-center gap-2 text-white/40 text-sm"><FileBarChart className="w-4 h-4"/> Data diekspor langsung dari database.</div></div>
    </>}
  </div>;
}
