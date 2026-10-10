import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import courtsRouter from './routes/courts.js';
import bookingsRouter from './routes/bookings.js';
import paymentsRouter from './routes/payments.js';
import checkinsRouter from './routes/checkins.js';
import adminRouter from './routes/admin.js';
import reportsRouter from './routes/reports.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/courts', courtsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/checkins', checkinsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reports', reportsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sport Booking API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
