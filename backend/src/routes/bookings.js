import { Router } from 'express';
import { prisma, generateToken, TIME_SLOTS } from '../utils.js';

const router = Router();

// GET /api/bookings - list all (admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { court: true, payment: true, checkin: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data booking' });
  }
});

// POST /api/bookings/check-availability - check booked slots
router.post('/check-availability', async (req, res) => {
  try {
    const { courtId, date } = req.body;
    const bookings = await prisma.booking.findMany({
      where: {
        courtId: parseInt(courtId),
        date,
        status: { in: ['pending', 'paid', 'checked_in'] },
      },
      select: { startTime: true },
    });
    res.json({ bookedSlots: bookings.map(b => b.startTime) });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengecek ketersediaan' });
  }
});

// POST /api/bookings - create booking
router.post('/', async (req, res) => {
  try {
    const { courtId, customerName, customerPhone, customerEmail, date, startTime, duration, paymentMethod } = req.body;

    const court = await prisma.court.findUnique({ where: { id: parseInt(courtId) } });
    if (!court) return res.status(404).json({ error: 'Lapangan tidak ditemukan' });

    const startIdx = TIME_SLOTS.indexOf(startTime);
    if (startIdx === -1) return res.status(400).json({ error: 'Jam mulai tidak valid' });
    const endIdx = startIdx + parseInt(duration);
    if (endIdx > TIME_SLOTS.length) return res.status(400).json({ error: 'Durasi melebihi jam operasional' });
    const endTime = TIME_SLOTS[endIdx];

    // Prevent double booking - database unique constraint
    const existing = await prisma.booking.findFirst({
      where: {
        courtId: court.id,
        date,
        startTime,
        status: { in: ['pending', 'paid', 'checked_in'] },
      },
    });
    if (existing) return res.status(409).json({ error: 'Slot ini sudah dipesan. Silakan pilih jam lain.' });

    // Calculate price on server
    const totalPrice = court.pricePerHour * parseInt(duration);

    const booking = await prisma.booking.create({
      data: {
        token: generateToken(),
        courtId: court.id,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        date,
        startTime,
        endTime,
        duration: parseInt(duration),
        totalPrice,
        status: 'pending',
        paymentMethod,
      },
      include: { court: true },
    });

    res.status(201).json(booking);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Slot ini sudah dipesan.' });
    }
    res.status(500).json({ error: 'Gagal membuat booking' });
  }
});

// POST /api/bookings/confirm-payment - simulate payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id: parseInt(bookingId) } });
    if (!booking) return res.status(404).json({ error: 'Booking tidak ditemukan' });
    if (booking.status !== 'pending') return res.status(400).json({ error: 'Booking sudah diproses' });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        bookingToken: booking.token,
        amount: booking.totalPrice,
        method: booking.paymentMethod,
        status: 'success',
      },
    });

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'paid' },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Gagal konfirmasi pembayaran' });
  }
});

// POST /api/bookings/check - check booking by token + phone
router.post('/check', async (req, res) => {
  try {
    const { token, phone } = req.body;
    const booking = await prisma.booking.findFirst({
      where: { token: token.trim(), customerPhone: phone.trim() },
      include: { court: true, payment: true, checkin: true },
    });
    if (!booking) return res.status(404).json({ error: 'Booking tidak ditemukan' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mencari booking' });
  }
});

// PUT /api/bookings/:id/cancel - cancel booking
router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'cancelled' },
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Gagal membatalkan booking' });
  }
});

export default router;
