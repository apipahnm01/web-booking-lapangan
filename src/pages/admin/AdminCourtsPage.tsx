import { useState } from 'react';
import { useAdminData } from '@/lib/useAdminData';
import { formatRupiah } from '@/lib/store';
import type { Court } from '@/lib/types';
import { Dumbbell, RefreshCw, Pencil, X, Save, CheckCircle2 } from 'lucide-react';

type EditableCourt = Court & { isActive: boolean };

export default function AdminCourtsPage() {
  const { courts, bookings, loading, error, reload } = useAdminData();
  const [editing, setEditing] = useState<EditableCourt | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [notice, setNotice] = useState('');

  function openEditor(court: EditableCourt) {
    setEditing(court);
    setName(court.name);
    setPrice(String(court.pricePerHour));
    setIsActive(court.isActive);
    setSaveError('');
    setNotice('');
  }

  async function saveCourt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const numericPrice = Number(price);
    if (!name.trim() || name.trim().length < 2) {
      setSaveError('Nama lapangan minimal 2 karakter.');
      return;
    }
    if (!Number.isSafeInteger(numericPrice) || numericPrice < 0) {
      setSaveError('Masukkan harga rupiah berupa angka bulat yang valid.');
      return;
    }

    setSaving(true);
    setSaveError('');
    try {
      const response = await fetch('/api/admin/courts', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, name: name.trim(), pricePerHour: numericPrice, isActive }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Perubahan lapangan gagal disimpan.');
      setEditing(null);
      setNotice('Data lapangan berhasil diperbarui.');
      await reload();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Perubahan lapangan gagal disimpan.');
    } finally {
      setSaving(false);
    }
  }

  return <div className="p-6 lg:p-8">
    <div className="flex items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Lapangan</h1>
        <p className="text-white/50">Ubah nama, harga per jam, dan status lapangan di sini.</p>
      </div>
      <button onClick={() => void reload()} className="btn-secondary shrink-0" disabled={loading}>
        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}/> Muat ulang
      </button>
    </div>

    {error && <div className="card mb-4 border border-red-500/30 text-red-300 text-sm">{error}</div>}
    {notice && <div className="card mb-4 border border-brand-500/30 text-brand-300 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>{notice}</div>}

    {loading ? <div className="card text-center py-12 text-white/50">Memuat lapangan...</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courts.map(c => {
        const rows = bookings.filter(b => b.courtId === c.id && b.status !== 'cancelled');
        const revenue = rows.filter(b => b.status === 'paid' || b.status === 'checked_in').reduce((sum, b) => sum + b.totalPrice, 0);
        return <div key={c.id} className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center">
              <Dumbbell className={`w-7 h-7 text-brand-400 ${c.sport === 'badminton' ? 'rotate-45' : ''}`}/>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${c.isActive ? 'bg-brand-500/10 text-brand-400' : 'bg-red-500/10 text-red-400'}`}>
              {c.isActive ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
          <h3 className="font-display font-bold text-white text-lg mb-1">{c.name}</h3>
          <p className="text-white/40 text-xs capitalize mb-2">{c.sport}</p>
          <p className="text-brand-400 font-semibold mb-4">{formatRupiah(c.pricePerHour)}/jam</p>
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mb-4">
            <div><p className="text-xs text-white/40">Total Booking</p><p className="text-white font-bold">{rows.length}</p></div>
            <div className="text-right"><p className="text-xs text-white/40">Pendapatan Lunas</p><p className="text-brand-400 font-bold">{formatRupiah(revenue)}</p></div>
          </div>
          <button onClick={() => openEditor(c)} className="btn-secondary w-full justify-center">
            <Pencil className="w-4 h-4"/> Edit Lapangan
          </button>
        </div>;
      })}
    </div>}

    {editing && <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !saving && setEditing(null)}>
      <form onSubmit={saveCourt} onClick={event => event.stopPropagation()} className="card w-full max-w-md border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-xl font-display font-bold text-white">Edit Lapangan</h2><p className="text-sm text-white/45 mt-1">Perubahan langsung tersimpan ke database.</p></div>
          <button type="button" onClick={() => setEditing(null)} disabled={saving} className="p-2 rounded-lg text-white/50 hover:bg-white/5"><X className="w-5 h-5"/></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-field">Nama Lapangan</label>
            <input className="input-field" value={name} onChange={event => setName(event.target.value)} maxLength={60} required placeholder="Contoh: Futsal 1"/>
          </div>
          <div>
            <label className="label-field">Jenis Olahraga</label>
            <input className="input-field capitalize opacity-70" value={editing.sport} disabled/>
            <p className="text-xs text-white/35 mt-1">Jenis olahraga tidak diubah agar data booking lama tetap sesuai.</p>
          </div>
          <div>
            <label className="label-field">Harga per Jam (Rp)</label>
            <input className="input-field" type="number" min="0" step="1000" value={price} onChange={event => setPrice(event.target.value)} required placeholder="150000"/>
          </div>
          <label className="flex items-center justify-between gap-4 rounded-xl bg-navy-700/70 border border-white/10 px-4 py-3">
            <span><span className="block text-sm font-medium text-white">Status Lapangan</span><span className="block text-xs text-white/40 mt-1">Lapangan nonaktif tidak tampil untuk customer.</span></span>
            <input type="checkbox" checked={isActive} onChange={event => setIsActive(event.target.checked)} className="w-5 h-5 accent-emerald-500"/>
          </label>
        </div>
        {saveError && <p className="mt-4 text-sm text-red-300">{saveError}</p>}
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={() => setEditing(null)} disabled={saving} className="btn-secondary flex-1 justify-center">Batal</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-50">
            <Save className="w-4 h-4"/>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>}
  </div>;
}
