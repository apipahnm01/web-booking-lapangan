import { adminDb, requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method tidak diizinkan.' });

  const { id, name, pricePerHour, isActive } = req.body || {};
  const cleanName = String(name || '').trim();
  const price = Number(pricePerHour);

  if (!id || cleanName.length < 2 || cleanName.length > 60) {
    return res.status(400).json({ error: 'Nama lapangan wajib diisi (2–60 karakter).' });
  }
  if (!Number.isSafeInteger(price) || price < 0 || price > 100000000) {
    return res.status(400).json({ error: 'Harga per jam harus berupa angka rupiah yang valid.' });
  }
  if (typeof isActive !== 'boolean') {
    return res.status(400).json({ error: 'Status lapangan tidak valid.' });
  }

  try {
    const { data, error } = await adminDb()
      .from('courts')
      .update({ name: cleanName, price_per_hour: price, is_active: isActive })
      .eq('id', id)
      .select('id, name, sport, price_per_hour, is_active')
      .single();
    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Nama lapangan tersebut sudah digunakan.' });
      throw error;
    }
    return res.status(200).json({ court: data });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Perubahan lapangan gagal disimpan.' });
  }
}
