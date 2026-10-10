import type { Booking, Payment, CheckIn, Customer } from './types';
import { COURTS } from './constants';

const BOOKINGS_KEY = 'sf_bookings';
const PAYMENTS_KEY = 'sf_payments';
const CHECKINS_KEY = 'sf_checkins';

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getBookings(): Booking[] {
  return load<Booking>(BOOKINGS_KEY).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function getBookingByToken(token: string): Booking | undefined {
  return load<Booking>(BOOKINGS_KEY).find(b => b.token === token);
}

export function getBookingByTokenAndPhone(token: string, phone: string): Booking | undefined {
  return load<Booking>(BOOKINGS_KEY).find(
    b => b.token === token.trim() && b.customerPhone === phone.trim()
  );
}

export function isSlotBooked(courtId: string, date: string, startTime: string): boolean {
  return load<Booking>(BOOKINGS_KEY).some(
    b => b.courtId === courtId && b.date === date && b.startTime === startTime &&
         (b.status === 'paid' || b.status === 'pending' || b.status === 'checked_in')
  );
}

export function getBookedSlots(courtId: string, date: string): string[] {
  return load<Booking>(BOOKINGS_KEY)
    .filter(b => b.courtId === courtId && b.date === date &&
                 (b.status === 'paid' || b.status === 'pending' || b.status === 'checked_in'))
    .map(b => b.startTime);
}

export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BK${token}`;
}

export function createBooking(data: Omit<Booking, 'id' | 'token' | 'createdAt' | 'status'>): Booking {
  const bookings = load<Booking>(BOOKINGS_KEY);
  if (isSlotBooked(data.courtId, data.date, data.startTime)) {
    throw new Error('Slot ini sudah dipesan. Silakan pilih jam lain.');
  }
  const booking: Booking = {
    ...data,
    id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    token: generateToken(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  save(BOOKINGS_KEY, bookings);
  return booking;
}

export function updateBookingStatus(bookingId: string, status: Booking['status']): void {
  const bookings = load<Booking>(BOOKINGS_KEY);
  const idx = bookings.findIndex(b => b.id === bookingId);
  if (idx !== -1) {
    bookings[idx].status = status;
    save(BOOKINGS_KEY, bookings);
  }
}

export function cancelBooking(bookingId: string): void {
  updateBookingStatus(bookingId, 'cancelled');
}

export function getPayments(): Payment[] {
  return load<Payment>(PAYMENTS_KEY).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function createPayment(data: Omit<Payment, 'id' | 'createdAt' | 'status'> & { status?: Payment['status'] }): Payment {
  const payments = load<Payment>(PAYMENTS_KEY);
  const payment: Payment = {
    ...data,
    status: data.status || 'success',
    id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  payments.push(payment);
  save(PAYMENTS_KEY, payments);
  return payment;
}

export function getCheckIns(): CheckIn[] {
  return load<CheckIn>(CHECKINS_KEY).sort((a, b) =>
    b.checkedInAt.localeCompare(a.checkedInAt)
  );
}

export function createCheckIn(booking: Booking): CheckIn | { error: string } {
  const checkins = load<CheckIn>(CHECKINS_KEY);
  if (checkins.some(c => c.bookingToken === booking.token)) {
    return { error: 'QR ini sudah pernah digunakan untuk check-in.' };
  }
  const checkin: CheckIn = {
    id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    bookingId: booking.id,
    bookingToken: booking.token,
    customerName: booking.customerName,
    courtName: booking.courtName,
    sport: booking.sport,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    checkedInAt: new Date().toISOString(),
  };
  checkins.push(checkin);
  save(CHECKINS_KEY, checkins);
  updateBookingStatus(booking.id, 'checked_in');
  return checkin;
}

export function getCustomers(): Customer[] {
  const bookings = load<Booking>(BOOKINGS_KEY).filter(b => b.status !== 'cancelled');
  const map = new Map<string, Customer>();
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
        email: b.customerEmail,
        bookings: 1,
        totalSpent: b.totalPrice,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

export function calculatePrice(courtId: string, duration: number): number {
  const court = COURTS.find(c => c.id === courtId);
  if (!court) return 0;
  return court.pricePerHour * duration;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const csv = [
    headers.join(','),
    ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
