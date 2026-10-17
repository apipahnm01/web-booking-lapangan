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
      return res.status(200).json({ data });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method tidak diizinkan.' });

    const token = String(req.body?.token || '').trim();
    if (!token) return res.status(400).json({ error: 'Masukkan kode QR atau kode booking.' });

    const { data: booking, error: bookingError } = await db.from('bookings')
      .select('id, token, court_id, court_name, sport, customer_name, customer_phone, customer_email, booking_date, start_time, end_time, duration, total_price, status, payment_method, created_at')
      .eq('token', token).maybeSingle();
    if (bookingError) throw bookingError;
    if (!booking) return res.status(404).json({ error: 'Booking dengan kode tersebut tidak ditemukan.' });
    if (booking.status === 'cancelled') return res.status(409).json({ error: 'Booking ini telah dibatalkan.' });
    if (booking.status === 'checked_in') return res.status(409).json({ error: 'QR ini sudah pernah digunakan untuk check-in.' });
    if (booking.status !== 'paid') return res.status(409).json({ error: 'Booking belum lunas. Check-in hanya bisa dilakukan setelah pembayaran dikonfirmasi.' });

    const { data: checkin, error: checkinError } = await db.from('checkins').insert({
      id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      booking_id: booking.id,
      booking_token: booking.token,
      customer_name: booking.customer_name,
      court_name: booking.court_name,
      sport: booking.sport,
      booking_date: booking.booking_date,
      start_time: booking.start_time,
      end_time: booking.end_time,
    }).select('id').single();
    if (checkinError) {
      if (checkinError.code === '23505') return res.status(409).json({ error: 'QR ini sudah pernah digunakan untuk check-in.' });
      throw checkinError;
    }

    const { error: updateError } = await db.from('bookings').update({ status: 'checked_in' })
      .eq('id', booking.id).eq('status', 'paid');
    if (updateError) throw updateError;

    return res.status(200).json({
      ok: true,
      message: 'Check-in berhasil!',
      booking: {
        id: booking.id, token: booking.token, courtId: booking.court_id,
        courtName: booking.court_name, sport: booking.sport,
        customerName: booking.customer_name, customerPhone: booking.customer_phone,
        customerEmail: booking.customer_email || '', date: booking.booking_date,
        startTime: booking.start_time, endTime: booking.end_time, duration: booking.duration,
        totalPrice: booking.total_price, status: 'checked_in',
        paymentMethod: booking.payment_method, createdAt: booking.created_at
      },
      checkinId: checkin.id
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan server.' });
  }
}
