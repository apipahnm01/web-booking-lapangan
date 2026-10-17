import { adminDb, requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    const db = adminDb();
    if (req.method === 'GET') {
      const { data, error } = await db.from('bookings')
        .select('id, token, court_name, customer_name, customer_phone, customer_email, booking_date, start_time, end_time, duration, total_price, status, payment_method, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ data });
    }
    if (req.method === 'PATCH') {
      const { id, status } = req.body || {};
      if (!id || status !== 'cancelled') return res.status(400).json({ error: 'Permintaan perubahan status tidak valid.' });
      const { data, error } = await db.from('bookings').update({ status: 'cancelled' }).eq('id', id).eq('status', 'pending').select('id').maybeSingle();
      if (error) throw error;
      if (!data) return res.status(409).json({ error: 'Booking tidak ditemukan atau statusnya sudah berubah.' });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method tidak diizinkan.' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan server.' });
  }
}
