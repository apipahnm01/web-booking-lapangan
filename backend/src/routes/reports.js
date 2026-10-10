import { Router } from 'express';
import { prisma } from '../utils.js';

const router = Router();

// GET /api/reports/summary - dashboard summary
router.get('/summary', async (req, res) => {
  try {
    const [bookings, payments, checkins, customers] = await Promise.all([
      prisma.booking.count(),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'success' } }),
      prisma.checkIn.count(),
      prisma.booking.findMany({
        where: { status: { not: 'cancelled' } },
        select: { customerPhone: true, totalPrice: true },
      }),
    ]);

    const totalRevenue = payments._sum.amount || 0;
    const uniqueCustomers = new Set(customers.map(c => c.customerPhone)).size;

    res.json({
      totalRevenue,
      totalBookings: bookings,
      totalCheckins: checkins,
      totalCustomers: uniqueCustomers,
    });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil ringkasan' });
  }
});

// GET /api/reports/revenue-by-court
router.get('/revenue-by-court', async (req, res) => {
  try {
    const courts = await prisma.court.findMany({
      include: {
        bookings: {
          where: { status: { in: ['paid', 'checked_in'] } },
        },
      },
    });
    const result = courts.map(c => ({
      name: c.name,
      sport: c.sport,
      count: c.bookings.length,
      revenue: c.bookings.reduce((sum, b) => sum + b.totalPrice, 0),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data pendapatan' });
  }
});

export default router;
