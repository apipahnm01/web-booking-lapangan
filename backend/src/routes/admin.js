import { Router } from 'express';
import { prisma } from '../utils.js';

const router = Router();

// POST /api/admin/login - login with access code
router.post('/login', async (req, res) => {
  try {
    const { code } = req.body;
    const accessCode = process.env.ADMIN_ACCESS_CODE || '202520';
    if (code === accessCode) {
      res.json({ success: true, token: 'admin-session' });
    } else {
      res.status(401).json({ error: 'Kode akses salah' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Gagal login' });
  }
});

// GET /api/admin/customers - aggregate customer data
router.get('/customers', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { status: { not: 'cancelled' } },
    });
    const map = new Map();
    for (const b of bookings) {
      const key = b.customerPhone;
      const existing = map.get(key);
      if (existing) {
        existing.bookings += 1;
        existing.totalSpent += b.totalPrice;
      } else {
        map.set(key, {
          name: b.customerName,
          phone: b.customerPhone,
          email: b.customerEmail || '',
          bookings: 1,
          totalSpent: b.totalPrice,
        });
      }
    }
    const customers = Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data customer' });
  }
});

export default router;
