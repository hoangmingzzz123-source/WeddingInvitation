create table if not exists public.published_invitations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  customer_id uuid not null references public.customers(id) on delete cascade,
  demo_id uuid not null unique references public.invitation_demos(id) on delete cascade,
  published_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists published_invitations_customer_idx
  on public.published_invitations(customer_id);

alter table public.published_invitations enable row level security;

drop policy if exists admin_manage_published_invitations on public.published_invitations;
create policy admin_manage_published_invitations on public.published_invitations
for all to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on table public.published_invitations from anon, authenticated;
grant select, insert, update, delete on table public.published_invitations to authenticated;
grant all on table public.published_invitations to service_role;

notify pgrst, 'reload schema';