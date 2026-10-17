import type { Court } from './types';

export const ADMIN_ACCESS_CODE = '202520';

export const COURTS: Court[] = [
  { id: 'futsal-1', name: 'Futsal 1', sport: 'futsal', pricePerHour: 150000 },
  { id: 'badminton-1', name: 'Badminton 1', sport: 'badminton', pricePerHour: 50000 },
  { id: 'badminton-2', name: 'Badminton 2', sport: 'badminton', pricePerHour: 50000 },
  { id: 'badminton-3', name: 'Badminton 3', sport: 'badminton', pricePerHour: 50000 },
  { id: 'badminton-4', name: 'Badminton 4', sport: 'badminton', pricePerHour: 50000 },
];

export const TIME_SLOTS: string[] = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00',
];

export const PAYMENT_METHODS = [
  { id: 'qris', label: 'QRIS', icon: 'scan' },
  { id: 'gopay', label: 'GoPay', icon: 'wallet' },
  { id: 'ovo', label: 'OVO', icon: 'wallet' },
  { id: 'dana', label: 'DANA', icon: 'wallet' },
  { id: 'transfer', label: 'Transfer Bank', icon: 'bank' },
  { id: 'cash', label: 'Tunai di Lokasi', icon: 'cash' },
];
