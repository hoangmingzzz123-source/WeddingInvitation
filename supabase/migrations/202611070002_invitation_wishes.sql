create table if not exists public.invitation_wishes (
  id uuid primary key default gen_random_uuid(),
  demo_id uuid not null references public.invitation_demos(id) on delete cascade,
  guest_name text not null check (char_length(guest_name) between 1 and 80),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists invitation_wishes_demo_created_idx
  on public.invitation_wishes(demo_id, created_at desc);

create table if not exists public.invitation_wish_shares (
  demo_id uuid primary key references public.invitation_demos(id) on delete cascade,
  token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.invitation_wishes enable row level security;
alter table public.invitation_wish_shares enable row level security;

revoke all on table public.invitation_wishes from anon, authenticated;
revoke all on table public.invitation_wish_shares from anon, authenticated;
grant all on table public.invitation_wishes to service_role;
grant all on table public.invitation_wish_shares to service_role;

notify pgrst, 'reload schema';
