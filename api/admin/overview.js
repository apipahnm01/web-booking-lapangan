import { adminDb, requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method tidak diizinkan.' });
  try {
    const db = adminDb();
    const [bookings, payments, checkins, courts] = await Promise.all([
      db.from('bookings').select('id, token, court_id, court_name, sport, customer_name, customer_phone, customer_email, booking_date, start_time, end_time, duration, total_price, status, payment_method, created_at').order('created_at', { ascending: false }),
      db.from('payments').select('id, booking_id, booking_token, amount, method, status, created_at').order('created_at', { ascending: false }),
      db.from('checkins').select('id, booking_id, booking_token, customer_name, court_name, sport, booking_date, start_time, end_time, checked_in_at').order('checked_in_at', { ascending: false }),
      db.from('courts').select('id, name, sport, price_per_hour, is_active').order('name', { ascending: true }),
    ]);
    const failed = [bookings, payments, checkins, courts].find(result => result.error);
    if (failed?.error) throw failed.error;
    return res.status(200).json({
      bookings: bookings.data ?? [],
      payments: payments.data ?? [],
      checkins: checkins.data ?? [],
      courts: courts.data ?? [],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Data admin gagal dimuat.' });
  }
}
