-- SportBooking Supabase schema
-- Safe baseline: customer records and transactions are not publicly readable or writable.
create table if not exists public.courts (
  id text primary key,
  name text not null unique,
  sport text not null check (sport in ('futsal','badminton')),
  price_per_hour integer not null check (price_per_hour >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id text primary key,
  token text not null unique,
  court_id text not null references public.courts(id),
  court_name text not null,
  sport text not null check (sport in ('futsal','badminton')),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  booking_date date not null,
  start_time text not null,
  end_time text not null,
  duration integer not null check (duration > 0),
  total_price integer not null check (total_price >= 0),
  status text not null default 'pending' check (status in ('pending','paid','cancelled','checked_in')),
  payment_method text not null,
  created_at timestamptz not null default now(),
  constraint unique_court_booking_slot unique (court_id, booking_date, start_time)
);

create table if not exists public.payments (
  id text primary key,
  booking_id text not null unique references public.bookings(id),
  booking_token text not null,
  amount integer not null check (amount >= 0),
  method text not null,
  status text not null default 'pending' check (status in ('success','failed','pending')),
  created_at timestamptz not null default now()
);

create table if not exists public.checkins (
  id text primary key,
  booking_id text not null unique references public.bookings(id),
  booking_token text not null,
  customer_name text not null,
  court_name text not null,
  sport text not null,
  booking_date date not null,
  start_time text not null,
  end_time text not null,
  checked_in_at timestamptz not null default now()
);

alter table public.courts enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.checkins enable row level security;

revoke all on public.bookings from anon, authenticated;
revoke all on public.payments from anon, authenticated;
revoke all on public.checkins from anon, authenticated;
grant select on public.courts to anon, authenticated;

drop policy if exists "Public can read active courts" on public.courts;
create policy "Public can read active courts" on public.courts
for select to anon, authenticated using (is_active = true);

insert into public.courts (id, name, sport, price_per_hour, is_active)
values
  ('futsal-1', 'Futsal 1', 'futsal', 150000, true),
  ('badminton-1', 'Badminton 1', 'badminton', 50000, true),
  ('badminton-2', 'Badminton 2', 'badminton', 50000, true),
  ('badminton-3', 'Badminton 3', 'badminton', 50000, true),
  ('badminton-4', 'Badminton 4', 'badminton', 50000, true)
on conflict (id) do update set name = excluded.name, sport = excluded.sport, price_per_hour = excluded.price_per_hour, is_active = excluded.is_active;
