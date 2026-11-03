-- Keep the existing per-IP and per-phone limits, and cap new sessions across all IPs.
create index if not exists photo_upload_created_at on public.photo_upload_sessions (created_at);

create function public.init_photo_request_limited(
  p_id uuid, p_hash text, p_fingerprint text, p_ip text, p_phone text,
  p_customer jsonb, p_photos jsonb, p_hourly_limit integer
)
returns uuid language plpgsql set search_path = public, pg_temp as $$
begin
  perform pg_advisory_xact_lock(hashtextextended('photo-upload-hourly-limit', 0));
  if not exists (select 1 from photo_upload_sessions where id = p_id)
    and (select count(*) from photo_upload_sessions where created_at > now() - interval '1 hour')
      >= least(500, greatest(1, coalesce(p_hourly_limit, 60))) then
    raise sqlstate 'PT429' using message = 'Có quá nhiều yêu cầu. Vui lòng thử lại sau.';
  end if;
  return public.init_photo_request(p_id, p_hash, p_fingerprint, p_ip, p_phone, p_customer, p_photos);
end $$;

alter table public.customers drop constraint customers_photo_sync_status_check;
alter table public.customers add constraint customers_photo_sync_status_check
  check (photo_sync_status in ('none','uploading','storage_ready','queued','syncing','ready','retrying','failed','abandoned'));

create function public.complete_photo_request(
  p_id uuid, p_hash text, p_lease uuid, p_results jsonb, p_sync_drive boolean
)
returns text language plpgsql set search_path = public, pg_temp as $$
declare
  s public.photo_upload_sessions;
  code text;
begin
  select * into s from photo_upload_sessions where id = p_id and token_hash = p_hash for update;
  if not found then raise sqlstate 'PT403' using message = 'Phiên tải ảnh không hợp lệ.'; end if;
  code := public.complete_photo_request(p_id, p_hash, p_lease, p_results);
  if s.completed_at is null and not p_sync_drive then
    -- The queue entry never becomes visible to a worker in Supabase-only mode.
    delete from drive_sync_jobs where customer_id = s.customer_id;
    update customers set photo_sync_status = 'storage_ready' where id = s.customer_id;
  end if;
  return code;
end $$;

revoke execute on function public.init_photo_request_limited(uuid,text,text,text,text,jsonb,jsonb,integer),
  public.complete_photo_request(uuid,text,uuid,jsonb,boolean) from public, anon, authenticated;
grant execute on function public.init_photo_request_limited(uuid,text,text,text,text,jsonb,jsonb,integer),
  public.complete_photo_request(uuid,text,uuid,jsonb,boolean) to service_role;

notify pgrst, 'reload schema';
