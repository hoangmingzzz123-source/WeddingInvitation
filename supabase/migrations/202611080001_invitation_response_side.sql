alter table public.invitation_rsvps
  add column if not exists side text check (side in ('groom', 'bride'));

alter table public.invitation_wishes
  add column if not exists side text check (side in ('groom', 'bride'));

notify pgrst, 'reload schema';
