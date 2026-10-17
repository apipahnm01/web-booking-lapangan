import { adminDb, requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method tidak diizinkan.' });
  const { booking_id } = req.body || {};
  if (!booking_id) return res.status(400).json({ error: 'ID booking wajib diisi.' });
  try {
    const { error } = await adminDb().rpc('admin_confirm_payment', { p_booking_id: booking_id });
    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Pembayaran belum berhasil dikonfirmasi.' });
  }
}
