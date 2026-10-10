export type SportType = 'futsal' | 'badminton';

export interface Court {
  id: string;
  name: string;
  sport: SportType;
  pricePerHour: number;
}

export interface Booking {
  id: string;
  token: string;
  courtId: string;
  courtName: string;
  sport: SportType;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: 'pending' | 'paid' | 'cancelled' | 'checked_in';
  paymentMethod: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  bookingToken: string;
  amount: number;
  method: string;
  status: 'success' | 'failed' | 'pending';
  createdAt: string;
}

export interface CheckIn {
  id: string;
  bookingId: string;
  bookingToken: string;
  customerName: string;
  courtName: string;
  sport: SportType;
  date: string;
  startTime: string;
  endTime: string;
  checkedInAt: string;
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
  bookings: number;
  totalSpent: number;
}
