alter table public.customers
  add column request_code text unique,
  add column drive_folder_id text unique,
  add column drive_folder_name text,
  add column photo_sync_status text not null default 'none'
    check (photo_sync_status in ('none','uploading','queued','syncing','ready','retrying','failed','abandoned'));

create table public.photo_upload_sessions (
  id uuid primary key,
  customer_id uuid not null unique references public.customers on delete cascade,
  token_hash text not null,
  fingerprint text not null,
  ip_hash text not null,
  phone_hash text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '24 hours',
  validation_lease uuid,
  validation_until timestamptz,
  completed_at timestamptz,
  cleaned_at timestamptz
);

create table public.customer_photos (
  id uuid primary key,
  customer_id uuid not null references public.customers on delete cascade,
  original_name text not null,
  original_mime text not null,
  original_size bigint not null check (original_size between 1 and 15728640),
  original_storage_path text not null unique,
  web_storage_path text unique,
  checksum_sha256 text,
  drive_file_id text unique,
  drive_md5 text,
  drive_web_view_link text,
  sort_order integer not null check (sort_order between 0 and 6),
  preferred_cover boolean not null default false,
  unique (customer_id, sort_order)
);

create table public.drive_sync_jobs (
  customer_id uuid primary key references public.customers on delete cascade,
  status text not null default 'queued' check (status in ('queued','syncing','retrying','ready','failed')),
  attempts int not null default 0,
  next_attempt_at timestamptz not null default now(),
  locked_until timestamptz,
  lease_id uuid,
  last_error text,
  completed_at timestamptz
);
create table public.photo_admin_audit (
  id bigint generated always as identity primary key,
  customer_id uuid,
  demo_id uuid,
  actor_id uuid,
  action text not null,
  created_at timestamptz not null default now()
);
create index drive_sync_due on public.drive_sync_jobs (status, next_attempt_at);
create index photo_upload_ip_rate on public.photo_upload_sessions (ip_hash, created_at);
create index photo_upload_phone_rate on public.photo_upload_sessions (phone_hash, created_at);

alter table public.photo_upload_sessions enable row level security;
alter table public.customer_photos enable row level security;
alter table public.drive_sync_jobs enable row level security;
alter table public.photo_admin_audit enable row level security;
revoke all on public.photo_upload_sessions, public.customer_photos, public.drive_sync_jobs, public.photo_admin_audit from public, anon, authenticated;
grant all on public.photo_upload_sessions, public.customer_photos, public.drive_sync_jobs, public.photo_admin_audit to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('customer-photos-original','customer-photos-original',false,15728640,array['image/jpeg','image/png','image/webp']),
  ('customer-demo-assets','customer-demo-assets',false,4194304,array['image/webp']),
  ('customer-demo-exports','customer-demo-exports',false,33554432,array['application/zip']);

create function public.init_photo_request(p_id uuid, p_hash text, p_fingerprint text, p_ip text, p_phone text, p_customer jsonb, p_photos jsonb)
returns uuid language plpgsql set search_path = public, pg_temp as $$
declare
  existing public.photo_upload_sessions;
  cid uuid := gen_random_uuid();
  photo jsonb;
  pid uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended('upload-ip:' || p_ip, 0));
  perform pg_advisory_xact_lock(hashtextextended('upload-phone:' || p_phone, 0));
  perform pg_advisory_xact_lock(hashtextextended(p_id::text, 0));
  select * into existing from photo_upload_sessions where id = p_id;
  if found then
    if existing.token_hash <> p_hash or existing.fingerprint <> p_fingerprint then
      raise sqlstate 'PT409' using message = 'Phiên tải ảnh đã có nội dung khác.';
    end if;
    return existing.customer_id;
  end if;
  if (select count(*) from photo_upload_sessions where ip_hash = p_ip and created_at > now()-interval '1 hour') >= 8
    or (select count(*) from photo_upload_sessions where phone_hash = p_phone and created_at > now()-interval '1 hour') >= 4 then
    raise sqlstate 'PT429' using message = 'Có quá nhiều yêu cầu. Vui lòng thử lại sau.';
  end if;
  insert into customers(id, full_name, phone, email, bride_name, groom_name, wedding_date, wedding_time,
    venue, address, message, selected_template_id, request_code, photo_sync_status, drive_folder_name)
  values(cid, p_customer->>'fullName', p_customer->>'phone', nullif(p_customer->>'email',''),
    p_customer->>'brideName', p_customer->>'groomName', nullif(p_customer->>'weddingDate','')::date,
    nullif(p_customer->>'weddingTime','')::time, coalesce(p_customer->>'venue',''), coalesce(p_customer->>'address',''),
    coalesce(p_customer->>'message',''), nullif(p_customer->>'selectedTemplateId',''),
    'REQ-' || to_char(now() at time zone 'Asia/Ho_Chi_Minh','YYYYMMDD') || '-' || upper(left(cid::text, 8)), 'uploading',
    (p_customer->>'phone') || ' + ' || (p_customer->>'phone'));
  insert into photo_upload_sessions(id, customer_id, token_hash, fingerprint, ip_hash, phone_hash)
    values(p_id, cid, p_hash, p_fingerprint, p_ip, p_phone);
  for photo in select value from jsonb_array_elements(p_photos) loop
    pid := gen_random_uuid();
    insert into customer_photos(id,customer_id,original_name,original_mime,original_size,original_storage_path,sort_order,preferred_cover)
    values(pid,cid,photo->>'filename',photo->>'mime',(photo->>'size')::bigint,
      'requests/' || cid || '/' || pid || '/original.' || (photo->>'ext'),
      (photo->>'order')::int,(photo->>'cover')::boolean);
  end loop;
  return cid;
end $$;

create function public.claim_photo_validation(p_id uuid, p_hash text, p_lease uuid)
returns boolean language sql set search_path = public, pg_temp as $$
  with claimed as (
    update photo_upload_sessions set validation_lease = p_lease, validation_until = now() + interval '6 minutes'
    where id = p_id and token_hash = p_hash and expires_at > now() and completed_at is null
      and (validation_until is null or validation_until <= now())
    returning id
  ) select exists(select 1 from claimed);
$$;

create function public.complete_photo_request(p_id uuid, p_hash text, p_lease uuid, p_results jsonb)
returns text language plpgsql set search_path = public, pg_temp as $$
declare
  s public.photo_upload_sessions;
  result jsonb;
  expected int;
begin
  select * into s from photo_upload_sessions where id = p_id and token_hash = p_hash for update;
  if not found then raise sqlstate 'PT403' using message = 'Phiên tải ảnh không hợp lệ.'; end if;
  if s.completed_at is null then
    if s.expires_at <= now() then raise sqlstate 'PT410' using message = 'Phiên tải ảnh đã hết hạn.'; end if;
    if s.validation_lease is distinct from p_lease or s.validation_until <= now() then
      raise sqlstate 'PT409' using message = 'Phiên xác thực ảnh đã hết hạn.';
    end if;
    select count(*) into expected from customer_photos where customer_id = s.customer_id;
    if expected not between 5 and 7 or jsonb_array_length(p_results) <> expected
      or (select count(distinct value->>'id') from jsonb_array_elements(p_results)) <> expected then
      raise sqlstate 'PT400' using message = 'Ảnh tải lên chưa đầy đủ.';
    end if;
    for result in select value from jsonb_array_elements(p_results) loop
      update customer_photos set checksum_sha256 = result->>'checksum', web_storage_path = result->>'path'
      where customer_id = s.customer_id and id = (result->>'id')::uuid;
      if not found then raise sqlstate 'PT403' using message = 'Ảnh không thuộc yêu cầu.'; end if;
    end loop;
    update photo_upload_sessions set completed_at = now(), validation_lease = null, validation_until = null where id = p_id;
    update customers set photo_sync_status = 'queued' where id = s.customer_id;
    insert into drive_sync_jobs(customer_id) values(s.customer_id);
  end if;
  return (select request_code from customers where id = s.customer_id);
end $$;

create function public.claim_drive_sync(p_customer uuid default null)
returns setof public.drive_sync_jobs language sql set search_path = public, pg_temp as $$
  update drive_sync_jobs j set status = 'syncing', attempts = j.attempts + 1,
    locked_until = now() + interval '10 minutes', lease_id = gen_random_uuid()
  where j.customer_id = (
    select customer_id from drive_sync_jobs
    where (p_customer is null or customer_id = p_customer)
      and ((status in ('queued','retrying') and next_attempt_at <= now())
        or (status = 'syncing' and locked_until <= now()))
    order by next_attempt_at limit 1 for update skip locked
  ) returning j.*;
$$;

create function public.settle_drive_sync(p_customer uuid, p_lease uuid, p_status text, p_error text, p_next timestamptz)
returns void language plpgsql set search_path = public, pg_temp as $$
begin
  update drive_sync_jobs set status = p_status, last_error = p_error, next_attempt_at = p_next,
    locked_until = null, lease_id = null, completed_at = case when p_status = 'ready' then now() else null end
  where customer_id = p_customer and lease_id = p_lease;
  if found then update customers set photo_sync_status = p_status where id = p_customer; end if;
end $$;

create function public.guard_demo_photos() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  refs jsonb := coalesce(new.payload->'photos','[]'::jsonb);
begin
  if jsonb_typeof(refs) <> 'array' or jsonb_array_length(refs) > 7 then
    raise exception 'Danh sách ảnh demo không hợp lệ.' using errcode = '22023';
  end if;
  if jsonb_array_length(refs) = 0 then return new; end if;
  if (select count(*) from jsonb_array_elements(refs) r where r->>'role' = 'cover') <> 1
    or (select count(distinct r->>'photoId') from jsonb_array_elements(refs) r) <> jsonb_array_length(refs)
    or exists (
      select 1 from jsonb_array_elements(refs) r
      where jsonb_typeof(r) <> 'object'
        or coalesce(r->>'role','') not in ('cover','gallery')
        or coalesce(r->>'order','') !~ '^[0-6]$'
        or r ? 'url'
        or not exists(select 1 from customer_photos p where p.id::text = r->>'photoId'
          and p.customer_id = new.customer_id and p.web_storage_path is not null)
    ) then
    raise sqlstate 'PT422' using message = 'Ảnh demo không hợp lệ hoặc không thuộc hồ sơ này.';
  end if;
  return new;
end $$;
create trigger invitation_demo_photo_ownership before insert or update of payload, customer_id
on public.invitation_demos for each row execute function public.guard_demo_photos();

create function public.audit_demo_photos() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if jsonb_array_length(coalesce(new.payload->'photos','[]'::jsonb)) > 0 then
    insert into photo_admin_audit(customer_id,demo_id,actor_id,action)
      values(new.customer_id,new.id,auth.uid(),'snapshot');
  end if;
  return new;
end $$;
create trigger invitation_demo_photo_audit after insert or update of payload
on public.invitation_demos for each row execute function public.audit_demo_photos();

create function public.retry_drive_sync(p_customer uuid) returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.is_admin() then raise sqlstate 'PT403' using message = 'Cần quyền quản trị.'; end if;
  update drive_sync_jobs set status='queued', attempts=0, next_attempt_at=now(), last_error=null
    where customer_id=p_customer and status in ('failed','retrying');
  if not found then return false; end if;
  update customers set photo_sync_status='queued' where id=p_customer;
  insert into photo_admin_audit(customer_id,actor_id,action) values(p_customer,auth.uid(),'retry');
  return true;
end $$;
revoke execute on function public.retry_drive_sync(uuid) from public, anon;
grant execute on function public.retry_drive_sync(uuid) to authenticated;

revoke execute on function public.init_photo_request(uuid,text,text,text,text,jsonb,jsonb),
  public.claim_photo_validation(uuid,text,uuid), public.complete_photo_request(uuid,text,uuid,jsonb),
  public.claim_drive_sync(uuid), public.settle_drive_sync(uuid,uuid,text,text,timestamptz) from public, anon, authenticated;
grant execute on function public.init_photo_request(uuid,text,text,text,text,jsonb,jsonb),
  public.claim_photo_validation(uuid,text,uuid), public.complete_photo_request(uuid,text,uuid,jsonb),
  public.claim_drive_sync(uuid), public.settle_drive_sync(uuid,uuid,text,text,timestamptz) to service_role;
