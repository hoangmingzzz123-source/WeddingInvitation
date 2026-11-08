alter table public.published_invitations
  add column if not exists expires_at timestamptz default (now() + interval '90 days');

notify pgrst, 'reload schema';
