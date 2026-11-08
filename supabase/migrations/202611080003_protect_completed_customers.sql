create or replace function public.prevent_completed_customer_removal()
returns trigger
language plpgsql
as $$
begin
  if old.status = 'completed' and (tg_op = 'DELETE' or new.status <> 'completed') then
    raise sqlstate 'PT409' using message = 'Khách hàng đã hoàn thành nên không thể xóa.';
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_completed_customer_delete on public.customers;
create trigger protect_completed_customer_delete
before delete on public.customers
for each row execute function public.prevent_completed_customer_removal();

drop trigger if exists protect_completed_customer_status on public.customers;
create trigger protect_completed_customer_status
before update of status on public.customers
for each row execute function public.prevent_completed_customer_removal();

notify pgrst, 'reload schema';
