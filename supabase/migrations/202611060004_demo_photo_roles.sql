create or replace function public.guard_demo_photos() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  refs jsonb := coalesce(new.payload->'photos','[]'::jsonb);
begin
  if jsonb_typeof(refs) <> 'array' or jsonb_array_length(refs) > 7 then
    raise exception 'Mỗi demo chỉ được chọn tối đa 7 ảnh.' using errcode = '22023';
  end if;
  if jsonb_array_length(refs) = 0 then return new; end if;
  if (select count(*) from jsonb_array_elements(refs) r where r->>'role' = 'cover') <> 1
    or (select count(*) from jsonb_array_elements(refs) r where r->>'role' = 'main') > 1
    or (select count(*) from jsonb_array_elements(refs) r where r->>'role' = 'video') > 1
    or (select count(distinct r->>'photoId') from jsonb_array_elements(refs) r) <> jsonb_array_length(refs)
    or (select count(distinct r->>'order') from jsonb_array_elements(refs) r) <> jsonb_array_length(refs)
    or exists (
      select 1 from jsonb_array_elements(refs) r
      where jsonb_typeof(r) <> 'object'
        or coalesce(r->>'role','') not in ('cover','main','video','gallery')
        or coalesce(r->>'order','') !~ '^[0-6]$'
        or r ? 'url'
        or not exists(select 1 from customer_photos p where p.id::text = r->>'photoId'
          and p.customer_id = new.customer_id and p.web_storage_path is not null)
    ) then
    raise sqlstate 'PT422' using message = 'Ảnh demo không hợp lệ hoặc không thuộc hồ sơ này.';
  end if;
  return new;
end $$;

notify pgrst, 'reload schema';
