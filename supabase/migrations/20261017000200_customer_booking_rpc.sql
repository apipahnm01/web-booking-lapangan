-- RPCs used by the public booking and lookup screens.
-- Direct anonymous access to bookings, payments and checkins remains revoked.

create or replace function public.get_booked_slots(p_court_id text, p_date date)
returns table(start_time text, duration integer)
language sql security definer set search_path = public
as $$
  select b.start_time, b.duration
  from public.bookings b
  where b.court_id = p_court_id and b.booking_date = p_date
    and b.status in ('pending','paid','checked_in');
$$;
revoke all on function public.get_booked_slots(text,date) from public;
grant execute on function public.get_booked_slots(text,date) to anon, authenticated;

create or replace function public.create_customer_booking(
  p_court_id text, p_sport text, p_customer_name text, p_customer_phone text,
  p_customer_email text, p_booking_date date, p_start_time text, p_duration integer,
  p_total_price integer, p_payment_method text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_court public.courts%rowtype;
  v_id text;
  v_token text;
  v_end_time text;
  v_booking public.bookings%rowtype;
begin
  if length(trim(coalesce(p_customer_name,''))) < 2 then raise exception 'Nama pemesan tidak valid'; end if;
  if length(regexp_replace(coalesce(p_customer_phone,''), '[^0-9]', '', 'g')) < 8 then raise exception 'Nomor HP tidak valid'; end if;
  if p_booking_date < current_date then raise exception 'Tanggal booking sudah lewat'; end if;
  if p_duration not between 1 and 3 then raise exception 'Durasi booking tidak valid'; end if;
  if p_start_time !~ '^(0[8-9]|1[0-9]|2[01]):00$' then raise exception 'Jam mulai tidak valid'; end if;
  if p_sport not in ('futsal','badminton') then raise exception 'Jenis olahraga tidak valid'; end if;
  select * into v_court from public.courts where id=p_court_id and is_active=true and sport=p_sport;
  if not found then raise exception 'Lapangan tidak ditemukan'; end if;
  if p_total_price <> v_court.price_per_hour * p_duration then raise exception 'Total harga tidak sesuai'; end if;
  v_end_time := to_char((p_start_time::time + make_interval(hours => p_duration)), 'HH24:MI');
  if v_end_time > '22:00' or v_end_time <= p_start_time then raise exception 'Jam selesai di luar jam operasional'; end if;
  if exists (
    select 1 from public.bookings b where b.court_id=p_court_id and b.booking_date=p_booking_date
      and b.status in ('pending','paid','checked_in')
      and p_start_time::time < b.end_time::time and v_end_time::time > b.start_time::time
  ) then raise exception 'Slot ini sudah dipesan. Silakan pilih jam lain.'; end if;

  v_id := 'b-' || gen_random_uuid()::text;
  v_token := 'BK' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.bookings(
    id,token,court_id,court_name,sport,customer_name,customer_phone,customer_email,
    booking_date,start_time,end_time,duration,total_price,status,payment_method
  ) values (
    v_id,v_token,v_court.id,v_court.name,p_sport,trim(p_customer_name),
    regexp_replace(trim(p_customer_phone),'[^0-9+]','','g'),nullif(trim(coalesce(p_customer_email,'')),''),
    p_booking_date,p_start_time,v_end_time,p_duration,p_total_price,
    'pending',p_payment_method
  ) returning * into v_booking;

  insert into public.payments(id,booking_id,booking_token,amount,method,status)
  values(
    'p-' || gen_random_uuid()::text,v_id,v_token,p_total_price,p_payment_method,
    'pending'
  );
  return jsonb_build_object(
    'id',v_booking.id,'token',v_booking.token,'courtId',v_booking.court_id,'courtName',v_booking.court_name,
    'sport',v_booking.sport,'customerName',v_booking.customer_name,'customerPhone',v_booking.customer_phone,
    'customerEmail',coalesce(v_booking.customer_email,''),'date',v_booking.booking_date,
    'startTime',v_booking.start_time,'endTime',v_booking.end_time,'duration',v_booking.duration,
    'totalPrice',v_booking.total_price,'status',v_booking.status,'paymentMethod',v_booking.payment_method,
    'createdAt',v_booking.created_at
  );
end;
$$;
revoke all on function public.create_customer_booking(text,text,text,text,text,date,text,integer,integer,text) from public;
grant execute on function public.create_customer_booking(text,text,text,text,text,date,text,integer,integer,text) to anon, authenticated;

create or replace function public.lookup_customer_booking(p_token text, p_phone text)
returns jsonb language sql security definer set search_path=public as $$
  select jsonb_build_object(
    'id',b.id,'token',b.token,'courtId',b.court_id,'courtName',b.court_name,'sport',b.sport,
    'customerName',b.customer_name,'customerPhone',b.customer_phone,'customerEmail',coalesce(b.customer_email,''),
    'date',b.booking_date,'startTime',b.start_time,'endTime',b.end_time,'duration',b.duration,
    'totalPrice',b.total_price,'status',b.status,'paymentMethod',b.payment_method,'createdAt',b.created_at
  )
  from public.bookings b
  where upper(b.token)=upper(trim(p_token))
    and regexp_replace(b.customer_phone,'[^0-9]','','g')=regexp_replace(trim(p_phone),'[^0-9]','','g')
  limit 1;
$$;
revoke all on function public.lookup_customer_booking(text,text) from public;
grant execute on function public.lookup_customer_booking(text,text) to anon, authenticated;
