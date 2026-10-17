import { adminDb, requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method tidak diizinkan.' });
  try {
    const { data, error } = await adminDb().from('payments')
      .select('id, booking_id, booking_token, amount, method, status, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan server.' });
  }
}
