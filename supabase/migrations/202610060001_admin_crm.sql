create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null default 'Quản trị viên',
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  bride_name text not null default '',
  groom_name text not null default '',
  email text,
  phone text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'demo_ready', 'confirmed', 'completed')),
  source text not null default 'website-form',
  notes text not null default '',
  wedding_date date,
  wedding_time time,
  venue text not null default '',
  address text not null default '',
  message text not null default '',
  selected_template_id text,
  cover_url text,
  confirmed_at timestamptz,
  exported_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invitation_demos (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  template_id text not null,
  public_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  status text not null default 'draft' check (status in ('draft', 'published', 'expired')),
  note text not null default '',
  expires_at timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.code_exports (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  demo_id uuid not null references public.invitation_demos(id) on delete cascade,
  exported_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists customers_status_idx on public.customers(status);
create index if not exists customers_created_at_idx on public.customers(created_at desc);
create index if not exists invitation_demos_customer_idx on public.invitation_demos(customer_id, created_at desc);
create index if not exists invitation_demos_public_token_idx on public.invitation_demos(public_token);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists invitation_demos_set_updated_at on public.invitation_demos;
create trigger invitation_demos_set_updated_at before update on public.invitation_demos
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.customers enable row level security;
alter table public.invitation_demos enable row level security;
alter table public.code_exports enable row level security;

drop policy if exists admin_read_admin_users on public.admin_users;
create policy admin_read_admin_users on public.admin_users
for select to authenticated using (public.is_admin());

drop policy if exists admin_manage_customers on public.customers;
create policy admin_manage_customers on public.customers
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists admin_manage_demos on public.invitation_demos;
create policy admin_manage_demos on public.invitation_demos
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists admin_read_exports on public.code_exports;
create policy admin_read_exports on public.code_exports
for select to authenticated using (public.is_admin());

revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.customers from anon, authenticated;
revoke all on table public.invitation_demos from anon, authenticated;
revoke all on table public.code_exports from anon, authenticated;

grant select on table public.admin_users to authenticated;
grant select, insert, update, delete on table public.customers to authenticated;
grant select, insert, update, delete on table public.invitation_demos to authenticated;
grant select on table public.code_exports to authenticated;
grant all on table public.admin_users, public.customers, public.invitation_demos, public.code_exports to service_role;

create or replace function public.get_public_demo(p_token text)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'id', d.id,
    'template_id', d.template_id,
    'note', d.note,
    'expires_at', d.expires_at,
    'payload', d.payload
  )
  from public.invitation_demos d
  where d.public_token = p_token
    and d.status = 'published'
    and (d.expires_at is null or d.expires_at > now())
  limit 1;
$$;

revoke all on function public.get_public_demo(text) from public;
grant execute on function public.get_public_demo(text) to anon, authenticated;

create or replace function public.submit_customer_request(
  p_full_name text,
  p_email text,
  p_phone text,
  p_bride_name text,
  p_groom_name text,
  p_wedding_date date,
  p_wedding_time time,
  p_venue text,
  p_address text,
  p_message text,
  p_selected_template_id text,
  p_cover_url text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  inserted_id uuid;
begin
  if length(trim(coalesce(p_full_name, ''))) < 2
    or length(trim(coalesce(p_phone, ''))) < 6
    or length(trim(coalesce(p_bride_name, ''))) < 1
    or length(trim(coalesce(p_groom_name, ''))) < 1 then
    raise exception 'Thông tin bắt buộc chưa hợp lệ.' using errcode = '22023';
  end if;

  insert into public.customers (
    full_name, email, phone, bride_name, groom_name, wedding_date, wedding_time,
    venue, address, message, selected_template_id, cover_url, source, status
  ) values (
    left(trim(p_full_name), 120), nullif(left(trim(coalesce(p_email, '')), 180), ''),
    left(trim(p_phone), 30), left(trim(p_bride_name), 80), left(trim(p_groom_name), 80),
    p_wedding_date, p_wedding_time, left(trim(coalesce(p_venue, '')), 180),
    left(trim(coalesce(p_address, '')), 300), left(trim(coalesce(p_message, '')), 1000),
    nullif(left(trim(coalesce(p_selected_template_id, '')), 100), ''),
    nullif(left(trim(coalesce(p_cover_url, '')), 1000), ''), 'website-form', 'new'
  ) returning id into inserted_id;

  return jsonb_build_object('id', inserted_id);
end;
$$;

revoke all on function public.submit_customer_request(text, text, text, text, text, date, time, text, text, text, text, text) from public;
grant execute on function public.submit_customer_request(text, text, text, text, text, date, time, text, text, text, text, text) to anon, authenticated;

-- Sau khi tạo user bằng Supabase Auth Dashboard, cấp quyền admin bằng lệnh:
-- insert into public.admin_users (user_id, email, display_name)
-- select id, email, 'Hoàng Minh' from auth.users where email = 'email-cua-ban@example.com';

