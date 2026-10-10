import { Router } from 'express';
import { prisma } from '../utils.js';

const router = Router();

// GET /api/courts - list all courts
router.get('/', async (req, res) => {
  try {
    const courts = await prisma.court.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
    res.json(courts);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data lapangan' });
  }
});

// GET /api/courts/:id
router.get('/:id', async (req, res) => {
  try {
    const court = await prisma.court.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!court) return res.status(404).json({ error: 'Lapangan tidak ditemukan' });
    res.json(court);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data lapangan' });
  }
});

export default router;
