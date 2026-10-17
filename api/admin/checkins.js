import { adminDb, requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    const db = adminDb();
    if (req.method === 'GET') {
      const { data, error } = await db.from('checkins')
        .select('id, booking_id, booking_token, customer_name, court_name, sport, booking_date, start_time, end_time, checked_in_at')
        .order('checked_in_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ data: data ?? [] });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method tidak diizinkan.' });

    let token = String(req.body?.token || '').trim();
    // Support scanning a raw token or a QR that contains a URL with token/code query.
    try {
      if (/^https?:\/\//i.test(token)) {
        const url = new URL(token);
        token = url.searchParams.get('token') || url.searchParams.get('code') || url.pathname.split('/').filter(Boolean).pop() || token;
      }
    } catch {}
    token = token.trim().toUpperCase();
    if (!token) return res.status(400).json({ error: 'Masukkan kode QR atau kode booking.' });

    const { data, error } = await db.rpc('admin_checkin_booking', { p_token: token });
    if (error) {
      const message = error.message || 'Check-in gagal diproses.';
      const status = /tidak ditemukan/i.test(message) ? 404 : /belum lunas|dibatalkan|sudah pernah|akses tidak diizinkan/i.test(message) ? 409 : 500;
      return res.status(status).json({ error: message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan server.' });
  }
}
