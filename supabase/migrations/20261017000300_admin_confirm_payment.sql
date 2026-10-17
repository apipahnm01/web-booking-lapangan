create or replace function public.admin_confirm_payment(p_booking_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
  v_booking public.bookings%rowtype;
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Hanya admin yang dapat mengonfirmasi pembayaran';
  end if;

  select * into v_booking
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    raise exception 'Booking tidak ditemukan';
  end if;

  if v_booking.status = 'cancelled' then
    raise exception 'Booking yang dibatalkan tidak dapat dilunasi';
  end if;

  select * into v_payment
  from public.payments
  where booking_id = p_booking_id
  for update;

  if not found then
    raise exception 'Data pembayaran tidak ditemukan';
  end if;

  update public.payments
  set status = 'success'
  where booking_id = p_booking_id;

  update public.bookings
  set status = 'paid'
  where id = p_booking_id
    and status in ('pending', 'paid');

  return jsonb_build_object(
    'booking_id', p_booking_id,
    'booking_status', 'paid',
    'payment_status', 'success'
  );
end;
$$;

revoke all on function public.admin_confirm_payment(text) from public, anon;
grant execute on function public.admin_confirm_payment(text) to authenticated;