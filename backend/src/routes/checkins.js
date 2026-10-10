import { Router } from 'express';
import { prisma } from '../utils.js';

const router = Router();

// GET /api/checkins - list all check-ins
router.get('/', async (req, res) => {
  try {
    const checkins = await prisma.checkIn.findMany({
      orderBy: { checkedInAt: 'desc' },
    });
    res.json(checkins);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data check-in' });
  }
});

// POST /api/checkins - check-in by QR token
router.post('/', async (req, res) => {
  try {
    const { token } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { token: token.trim() },
      include: { court: true, checkin: true },
    });

    if (!booking) return res.status(404).json({ error: 'Booking tidak ditemukan' });
    if (booking.status === 'cancelled') return res.status(400).json({ error: 'Booking telah dibatalkan' });
    if (booking.status === 'pending') return res.status(400).json({ error: 'Booking belum dibayar' });
    if (booking.checkin) return res.status(400).json({ error: 'QR ini sudah pernah digunakan untuk check-in' });

    const checkin = await prisma.checkIn.create({
      data: {
        bookingId: booking.id,
        bookingToken: booking.token,
        customerName: booking.customerName,
        courtName: booking.court.name,
        sport: booking.court.sport,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'checked_in' },
    });

    res.status(201).json(checkin);
  } catch (err) {
    res.status(500).json({ error: 'Gagal melakukan check-in' });
  }
});

export default router;
