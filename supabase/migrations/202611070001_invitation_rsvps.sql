create table if not exists public.invitation_rsvps (
  id uuid primary key default gen_random_uuid(),
  demo_id uuid not null references public.invitation_demos(id) on delete cascade,
  guest_name text not null check (char_length(guest_name) between 1 and 120),
  attending text not null check (attending in ('yes', 'no')),
  guest_count integer not null check (guest_count between 0 and 20),
  email text,
  message text,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check ((attending = 'yes' and guest_count >= 1) or (attending = 'no' and guest_count = 0))
);

create index if not exists invitation_rsvps_demo_created_idx
  on public.invitation_rsvps(demo_id, created_at desc);

create table if not exists public.invitation_rsvp_shares (
  demo_id uuid primary key references public.invitation_demos(id) on delete cascade,
  token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.invitation_rsvps enable row level security;
alter table public.invitation_rsvp_shares enable row level security;

revoke all on table public.invitation_rsvps from anon, authenticated;
revoke all on table public.invitation_rsvp_shares from anon, authenticated;
grant all on table public.invitation_rsvps to service_role;
grant all on table public.invitation_rsvp_shares to service_role;

notify pgrst, 'reload schema';
