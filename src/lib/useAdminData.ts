import { useCallback, useEffect, useState } from 'react';
import type { Booking, Payment, CheckIn, Customer, Court, SportType } from './types';

type AdminCourt = Court & { isActive: boolean };
type Payload = {
  bookings?: any[];
  payments?: any[];
  checkins?: any[];
  courts?: any[];
  error?: string;
};

export function useAdminData() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [courts, setCourts] = useState<AdminCourt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/overview', { credentials: 'same-origin' });
      const payload = await response.json() as Payload;
      if (!response.ok) throw new Error(payload.error || 'Data admin gagal dimuat.');
      setBookings((payload.bookings ?? []).map((b): Booking => ({
        id: b.id, token: b.token, courtId: b.court_id, courtName: b.court_name,
        sport: b.sport as SportType, customerName: b.customer_name, customerPhone: b.customer_phone,
        customerEmail: b.customer_email ?? '', date: b.booking_date, startTime: b.start_time,
        endTime: b.end_time, duration: Number(b.duration), totalPrice: Number(b.total_price),
        status: b.status, paymentMethod: b.payment_method, createdAt: b.created_at,
      })));
      setPayments((payload.payments ?? []).map((p): Payment => ({
        id: p.id, bookingId: p.booking_id, bookingToken: p.booking_token,
        amount: Number(p.amount), method: p.method, status: p.status, createdAt: p.created_at,
      })));
      setCheckIns((payload.checkins ?? []).map((c): CheckIn => ({
        id: c.id, bookingId: c.booking_id, bookingToken: c.booking_token,
        customerName: c.customer_name, courtName: c.court_name, sport: c.sport as SportType,
        date: c.booking_date, startTime: c.start_time, endTime: c.end_time, checkedInAt: c.checked_in_at,
      })));
      setCourts((payload.courts ?? []).map((c): AdminCourt => ({
        id: c.id, name: c.name, sport: c.sport as SportType,
        pricePerHour: Number(c.price_per_hour), isActive: Boolean(c.is_active),
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Data admin gagal dimuat.');
      setBookings([]); setPayments([]); setCheckIns([]); setCourts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const customers: Customer[] = (() => {
    const map = new Map<string, Customer>();
    for (const b of bookings.filter(item => item.status !== 'cancelled')) {
      const key = b.customerPhone || b.customerName;
      const customer = map.get(key);
      if (customer) {
        customer.bookings += 1;
        if (b.status === 'paid' || b.status === 'checked_in') customer.totalSpent += b.totalPrice;
      } else {
        map.set(key, {
          name: b.customerName, phone: b.customerPhone, email: b.customerEmail,
          bookings: 1, totalSpent: b.status === 'paid' || b.status === 'checked_in' ? b.totalPrice : 0,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  })();

  return { bookings, payments, checkIns, courts, customers, loading, error, reload };
}
