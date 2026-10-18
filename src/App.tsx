import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from '@/components/CustomerLayout';
import AdminLayout from '@/components/AdminLayout';
import RequireAuth from '@/components/RequireAuth';
import GoogleLoginPage from '@/pages/GoogleLoginPage';
import HomePage from '@/pages/customer/HomePage';
import BookingPage from '@/pages/customer/BookingPage';
import CheckBookingPage from '@/pages/customer/CheckBookingPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminGuard from '@/pages/admin/AdminGuard';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCourtsPage from '@/pages/admin/AdminCourtsPage';
import AdminSchedulePage from '@/pages/admin/AdminSchedulePage';
import AdminBookingsPage from '@/pages/admin/AdminBookingsPage';
import AdminCustomersPage from '@/pages/admin/AdminCustomersPage';
import AdminPaymentsPage from '@/pages/admin/AdminPaymentsPage';
import AdminScanPage from '@/pages/admin/AdminScanPage';
import AdminCheckInsPage from '@/pages/admin/AdminCheckInsPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<GoogleLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<RequireAuth />}>
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/cek-booking" element={<CheckBookingPage />} />
          </Route>

          <Route element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/lapangan" element={<AdminCourtsPage />} />
              <Route path="/admin/jadwal" element={<AdminSchedulePage />} />
              <Route path="/admin/booking" element={<AdminBookingsPage />} />
              <Route path="/admin/customer" element={<AdminCustomersPage />} />
              <Route path="/admin/pembayaran" element={<AdminPaymentsPage />} />
              <Route path="/admin/scan" element={<AdminScanPage />} />
              <Route path="/admin/check-in" element={<AdminCheckInsPage />} />
              <Route path="/admin/laporan" element={<AdminReportsPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
