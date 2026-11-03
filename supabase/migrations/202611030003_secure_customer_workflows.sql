-- Contact-only requests share the same quotas and idempotency as photo requests.
create function public.submit_contact_request(
  p_id uuid, p_hash text, p_fingerprint text, p_ip text, p_phone text,
  p_customer jsonb, p_hourly_limit integer
)
returns text language plpgsql set search_path = public, pg_temp as $$
declare
  cid uuid;
begin
  cid := public.init_photo_request_limited(
    p_id, p_hash, p_fingerprint, p_ip, p_phone, p_customer, '[]'::jsonb, p_hourly_limit
  );
  update photo_upload_sessions set completed_at = now()
    where id = p_id and completed_at is null;
  if found then
    update customers set photo_sync_status = 'none', drive_folder_name = null where id = cid;
  end if;
  return (select request_code from customers where id = cid);
end $$;

-- Store the export event and its customer timestamp in one transaction.
create function public.record_invitation_export(p_customer uuid, p_demo uuid, p_actor uuid)
returns void language plpgsql set search_path = public, pg_temp as $$
begin
  perform 1 from admin_users where user_id = p_actor for share;
  if not found then raise sqlstate 'PT403' using message = 'Tài khoản không có quyền xuất thiệp.'; end if;

  update customers set exported_at = now()
    where id = p_customer and status in ('confirmed', 'completed');
  if not found then raise sqlstate 'PT409' using message = 'Hồ sơ chưa đủ điều kiện xuất thiệp.'; end if;

  perform 1 from invitation_demos where id = p_demo and customer_id = p_customer for share;
  if not found then raise sqlstate 'PT409' using message = 'Demo không thuộc hồ sơ.'; end if;
  insert into code_exports(customer_id, demo_id, exported_by) values (p_customer, p_demo, p_actor);
end $$;

revoke execute on function public.submit_customer_request(text,text,text,text,text,date,time,text,text,text,text,text),
  public.get_public_demo(text), public.submit_contact_request(uuid,text,text,text,text,jsonb,integer),
  public.record_invitation_export(uuid,uuid,uuid) from public, anon, authenticated;
grant execute on function public.submit_contact_request(uuid,text,text,text,text,jsonb,integer),
  public.record_invitation_export(uuid,uuid,uuid) to service_role;
grant select on public.admin_users to service_role;

notify pgrst, 'reload schema';
