import { Router } from 'express';
import { prisma } from '../utils.js';

const router = Router();

// GET /api/payments - list all payments
router.get('/', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data pembayaran' });
  }
});

export default router;
