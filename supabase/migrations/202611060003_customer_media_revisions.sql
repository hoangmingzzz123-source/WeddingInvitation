alter table public.customer_photos
  drop constraint if exists customer_photos_sort_order_check;
alter table public.customer_photos
  add constraint customer_photos_sort_order_check check (sort_order between 0 and 29);

alter table public.custom_invitation_templates
  add column if not exists owner_customer_id uuid references public.customers(id) on delete cascade,
  add column if not exists owner_demo_id uuid references public.invitation_demos(id) on delete cascade;

alter table public.custom_invitation_templates
  drop constraint if exists custom_invitation_templates_owner_pair_check;
alter table public.custom_invitation_templates
  add constraint custom_invitation_templates_owner_pair_check
  check ((owner_customer_id is null) = (owner_demo_id is null));

create index if not exists custom_invitation_templates_owner_demo_idx
  on public.custom_invitation_templates(owner_customer_id, owner_demo_id)
  where owner_customer_id is not null;

create or replace function public.guard_demo_photos() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  refs jsonb := coalesce(new.payload->'photos','[]'::jsonb);
begin
  if jsonb_typeof(refs) <> 'array' or jsonb_array_length(refs) > 30 then
    raise exception 'Danh sách ảnh demo không hợp lệ.' using errcode = '22023';
  end if;
  if jsonb_array_length(refs) = 0 then return new; end if;
  if (select count(*) from jsonb_array_elements(refs) r where r->>'role' = 'cover') <> 1
    or (select count(distinct r->>'photoId') from jsonb_array_elements(refs) r) <> jsonb_array_length(refs)
    or exists (
      select 1 from jsonb_array_elements(refs) r
      where jsonb_typeof(r) <> 'object'
        or coalesce(r->>'role','') not in ('cover','gallery')
        or coalesce(r->>'order','') !~ '^(?:[0-9]|[12][0-9])$'
        or r ? 'url'
        or not exists(select 1 from customer_photos p where p.id::text = r->>'photoId'
          and p.customer_id = new.customer_id and p.web_storage_path is not null)
    ) then
    raise sqlstate 'PT422' using message = 'Ảnh demo không hợp lệ hoặc không thuộc hồ sơ này.';
  end if;
  return new;
end $$;

notify pgrst, 'reload schema';
