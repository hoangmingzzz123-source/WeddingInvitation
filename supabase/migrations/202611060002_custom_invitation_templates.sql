create table if not exists public.custom_invitation_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  entry_file text not null default 'index.html',
  manifest jsonb not null,
  file_paths jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.custom_invitation_templates enable row level security;

drop policy if exists admin_manage_custom_invitation_templates on public.custom_invitation_templates;
create policy admin_manage_custom_invitation_templates on public.custom_invitation_templates
for all to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on table public.custom_invitation_templates from anon, authenticated;
grant select, insert, update, delete on public.custom_invitation_templates to authenticated;
grant all on public.custom_invitation_templates to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'custom-invitation-templates',
  'custom-invitation-templates',
  true,
  4194304,
  array['text/html', 'text/css', 'text/markdown', 'application/javascript', 'application/json', 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'font/woff', 'font/woff2', 'font/ttf', 'font/otf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

notify pgrst, 'reload schema';