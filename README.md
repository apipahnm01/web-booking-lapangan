# SportBooking - Sistem Booking Lapangan Futsal & Badminton

Aplikasi web full-stack untuk booking lapangan futsal dan badminton dengan QR Code check-in. Dibangun dengan React, TypeScript, Tailwind CSS, dan Express + MySQL + Prisma ORM.

## Fitur

### Customer (tanpa login/register)
- Pilih jenis lapangan (Futsal / Badminton)
- Pilih lapangan, tanggal, dan jam (slot 1 jam, 08:00–22:00)
- Isi data diri (nama, nomor HP, email opsional)
- Checkout dengan pembayaran simulasi (QRIS, GoPay, OVO, DANA, Transfer, Tunai)
- Mendapatkan kode booking + QR Code
- Cek booking dengan kode booking + nomor HP

### Admin (login dengan kode akses `202520`)
- **Dashboard** — ringkasan pendapatan, booking, check-in, customer
- **Lapangan** — daftar semua lapangan dan statistik
- **Jadwal** — lihat ketersediaan slot per lapangan per tanggal
- **Booking** — kelola semua booking (cari, filter, batalkan)
- **Customer** — daftar semua customer
- **Pembayaran** — riwayat semua transaksi
- **Scan QR** — scan QR Code dengan kamera browser untuk check-in
- **Check-in** — riwayat check-in customer
- **Laporan** — ringkasan + export CSV

### Lapangan Tersedia
| Lapangan | Jenis | Harga/Jam |
|---|---|---|
| Futsal 1 | Futsal | Rp 150.000 |
| Badminton 1 | Badminton | Rp 50.000 |
| Badminton 2 | Badminton | Rp 50.000 |
| Badminton 3 | Badminton | Rp 50.000 |
| Badminton 4 | Badminton | Rp 50.000 |

### Mencegah Double Booking
Sistem mencegah pemesanan ganda melalui:
- **Frontend**: slot yang sudah dipesan ditandai dan tidak bisa dipilih
- **Backend/Database**: unique constraint pada `(courtId, date, startTime)` di tabel bookings
- **Validasi server**: cek existing booking sebelum membuat baru

---

## Cara Menjalankan di Windows (XAMPP + MySQL)

### Prasyarat
- [Node.js](https://nodejs.org/) v18 atau newer
- [XAMPP](https://www.apachefriends.org/) (untuk MySQL)
- Browser modern (Chrome/Firefox/Edge)

### Langkah 1: Install XAMPP dan Jalankan MySQL
1. Download dan install XAMPP dari https://www.apachefriends.org/
2. Buka **XAMPP Control Panel**
3. Klik **Start** pada **Apache** dan **MySQL**

### Langkah 2: Buat Database
1. Buka browser, akses `http://localhost/phpmyadmin`
2. Klik **New** di sidebar kiri
3. Buat database baru dengan nama `sport_booking`
4. Pilih collation `utf8mb4_general_ci`
5. Klik **Create**

### Langkah 3: Clone/Download Project
```bash
# Jika menggunakan git
git clone <repository-url>
cd sport-booking

# Atau ekstrak file ZIP project ke folder, lalu buka terminal di folder tersebut
```

### Langkah 4: Install Dependencies Frontend
```bash
npm install
```

### Langkah 5: Setup Environment
```bash
# Salin file environment
copy .env.example .env

# Edit .env jika perlu (default sudah sesuai untuk XAMPP)
# DATABASE_URL="mysql://root:localhost:3306/sport_booking"
```

### Langkah 6: Setup Backend
```bash
# Masuk ke folder backend
cd backend

# Install dependencies backend
npm install

# Generate Prisma Client
npx prisma generate

# Jalankan migration (membuat tabel di database)
npx prisma db push

# Jalankan seed (mengisi data awal: admin & lapangan)
node prisma/seed.js

# Kembali ke folder utama
cd ..
```

### Langkah 7: Jalankan Aplikasi
```bash
# Jalankan frontend (terminal 1)
npm run dev
# Frontend berjalan di http://localhost:5173

# Jalankan backend (terminal 2, di folder backend)
cd backend
npm start
# Backend berjalan di http://localhost:3001
```

Buka browser dan akses `http://localhost:5173`

### Login Admin
- URL: `http://localhost:5173/admin/login`
- Kode Akses: `202520`

---

## Struktur Project

```
sport-booking/
├── src/                         # Frontend (React + TypeScript)
│   ├── components/              # Komponen reusable
│   │   ├── AdminLayout.tsx      # Layout sidebar admin
│   │   ├── CustomerLayout.tsx   # Layout navbar customer
│   │   ├── QRCodeDisplay.tsx    # Generate QR Code
│   │   └── QRScanner.tsx        # Scan QR dengan kamera
│   ├── lib/                     # Utility & data store
│   │   ├── constants.ts         # Konstanta (lapangan, jam, harga)
│   │   ├── store.ts             # Data store (localStorage)
│   │   └── types.ts             # TypeScript types
│   ├── pages/
│   │   ├── customer/            # Halaman customer
│   │   │   ├── HomePage.tsx
│   │   │   ├── BookingPage.tsx
│   │   │   └── CheckBookingPage.tsx
│   │   └── admin/               # Halaman admin
│   │       ├── AdminLoginPage.tsx
│   │       ├── AdminDashboardPage.tsx
│   │       ├── AdminCourtsPage.tsx
│   │       ├── AdminSchedulePage.tsx
│   │       ├── AdminBookingsPage.tsx
│   │       ├── AdminCustomersPage.tsx
│   │       ├── AdminPaymentsPage.tsx
│   │       ├── AdminScanPage.tsx
│   │       ├── AdminCheckInsPage.tsx
│   │       ├── AdminReportsPage.tsx
│   │       └── AdminGuard.tsx
│   ├── App.tsx                  # Routing utama
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── backend/                     # Backend (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma        # Skema database
│   │   └── seed.js              # Data seed
│   ├── src/
│   │   ├── server.js            # Express server
│   │   ├── utils.js             # Utility functions
│   │   └── routes/
│   │       ├── courts.js        # API lapangan
│   │       ├── bookings.js      # API booking
│   │       ├── payments.js      # API pembayaran
│   │       ├── checkins.js      # API check-in
│   │       ├── admin.js         # API admin
│   │       └── reports.js       # API laporan
│   └── package.json
├── prisma/                      # Prisma schema (root level)
│   ├── schema.prisma
│   └── seed.ts
├── .env.example                 # Template environment variables
├── package.json                 # Dependencies frontend
├── tailwind.config.js           # Konfigurasi Tailwind
├── vite.config.ts               # Konfigurasi Vite
└── README.md
```

---

## Backup Database

### Cara 1: phpMyAdmin
1. Buka `http://localhost/phpmyadmin`
2. Pilih database `sport_booking`
3. Klik tab **Export**
4. Pilih format **SQL**
5. Klik **Go** untuk download backup

### Cara 2: Command Line (mysqldump)
```bash
# Buka Command Prompt, lalu jalankan:
"C:\xampp\mysql\bin\mysqldump.exe" -u root sport_booking > backup.sql
```

## Restore Database

### Cara 1: phpMyAdmin
1. Buka `http://localhost/phpmyadmin`
2. Pilih database `sport_booking` (atau buat baru)
3. Klik tab **Import**
4. Pilih file backup `.sql`
5. Klik **Go**

### Cara 2: Command Line
```bash
# Pastikan database sport_booking sudah ada
"C:\xampp\mysql\bin\mysql.exe" -u root sport_booking < backup.sql
```

---

## API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/courts` | List semua lapangan |
| GET | `/api/courts/:id` | Detail lapangan |
| POST | `/api/bookings/check-availability` | Cek slot tersedia |
| POST | `/api/bookings` | Buat booking baru |
| POST | `/api/bookings/confirm-payment` | Konfirmasi pembayaran |
| POST | `/api/bookings/check` | Cek booking by token + HP |
| PUT | `/api/bookings/:id/cancel` | Batalkan booking |
| GET | `/api/bookings` | List semua booking (admin) |
| GET | `/api/payments` | List semua pembayaran |
| POST | `/api/checkins` | Check-in by QR token |
| GET | `/api/checkins` | List semua check-in |
| POST | `/api/admin/login` | Login admin |
| GET | `/api/admin/customers` | List customer (aggregated) |
| GET | `/api/reports/summary` | Ringkasan dashboard |
| GET | `/api/reports/revenue-by-court` | Pendapatan per lapangan |

---

## Database Schema (Prisma)

### Tabel: users
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | Int (PK, Auto) | ID |
| username | String (Unique) | Username admin |
| passwordHash | String | Kode akses |
| role | String | Role (default: admin) |
| createdAt | DateTime | Tanggal dibuat |
| updatedAt | DateTime | Tanggal update |

### Tabel: courts
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | Int (PK, Auto) | ID |
| name | String (Unique) | Nama lapangan |
| sport | String | futsal / badminton |
| pricePerHour | Int | Harga per jam |
| isActive | Boolean | Status aktif |

### Tabel: bookings
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | Int (PK, Auto) | ID |
| token | String (Unique) | Kode booking (BKXXXXXXXX) |
| courtId | Int (FK) | ID lapangan |
| customerName | String | Nama customer |
| customerPhone | String | Nomor HP |
| customerEmail | String? | Email (opsional) |
| date | String | Tanggal main (YYYY-MM-DD) |
| startTime | String | Jam mulai (HH:MM) |
| endTime | String | Jam selesai (HH:MM) |
| duration | Int | Durasi (jam) |
| totalPrice | Int | Total harga |
| status | String | pending/paid/cancelled/checked_in |
| paymentMethod | String | Metode pembayaran |

**Unique constraint**: `(courtId, date, startTime)` — mencegah double booking

### Tabel: payments
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | Int (PK, Auto) | ID |
| bookingId | Int (FK, Unique) | ID booking |
| bookingToken | String | Kode booking |
| amount | Int | Jumlah pembayaran |
| method | String | Metode pembayaran |
| status | String | success/failed/pending |

### Tabel: checkins
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | Int (PK, Auto) | ID |
| bookingId | Int (FK, Unique) | ID booking |
| bookingToken | String | Kode booking |
| customerName | String | Nama customer |
| courtName | String | Nama lapangan |
| sport | String | Jenis olahraga |
| date | String | Tanggal main |
| startTime | String | Jam mulai |
| endTime | String | Jam selesai |
| checkedInAt | DateTime | Waktu check-in |

---

## Teknologi

| Komponen | Teknologi |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Routing | React Router DOM |
| QR Code | qrcode + html5-qrcode |
| Backend | Node.js + Express |
| Database | MySQL (XAMPP) |
| ORM | Prisma |
| Bahasa | Bahasa Indonesia |

## Lisensi

MIT License - bebas digunakan untuk keperluan personal dan komersial.
