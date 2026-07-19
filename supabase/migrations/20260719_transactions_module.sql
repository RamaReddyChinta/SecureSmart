alter table public.transactions
  add column if not exists time time,
  add column if not exists merchant text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists payment_method text,
  add column if not exists receipt_path text,
  add column if not exists recurring_frequency text check (recurring_frequency in ('weekly','monthly','yearly')),
  add column if not exists transfer_id uuid;
alter table public.transactions drop constraint if exists transactions_transaction_type_check;
alter table public.transactions add constraint transactions_transaction_type_check check (transaction_type in ('income','expense','transfer'));
create index if not exists transactions_user_date_idx on public.transactions (user_id, date desc);
create index if not exists transactions_transfer_idx on public.transactions (transfer_id);
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false) on conflict (id) do nothing;
create policy "receipt objects are private" on storage.objects for all using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]) with check (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);
create or replace function public.create_transfer(p_source_account uuid, p_destination_account uuid, p_amount numeric, p_date date, p_time time default null, p_notes text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_transfer uuid := gen_random_uuid(); v_source numeric; v_destination numeric;
begin
  if p_source_account is null or p_destination_account is null or p_source_account = p_destination_account then raise exception 'Choose two different accounts'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'Transfer amount must be greater than zero'; end if;
  select current_balance into v_source from public.accounts where id = p_source_account and user_id = v_user and is_active for update;
  select current_balance into v_destination from public.accounts where id = p_destination_account and user_id = v_user and is_active for update;
  if v_source is null or v_destination is null then raise exception 'One or both accounts are unavailable'; end if;
  if v_source < p_amount then raise exception 'Insufficient source account balance'; end if;
  update public.accounts set current_balance = current_balance - p_amount where id = p_source_account;
  update public.accounts set current_balance = current_balance + p_amount where id = p_destination_account;
  insert into public.transactions (user_id, account_id, amount, transaction_type, notes, date, time, transfer_id) values
    (v_user, p_source_account, p_amount, 'transfer', coalesce(p_notes, 'Transfer out'), p_date, p_time, v_transfer),
    (v_user, p_destination_account, p_amount, 'transfer', coalesce(p_notes, 'Transfer in'), p_date, p_time, v_transfer);
  return v_transfer;
end; $$;
create or replace function public.apply_transaction_balance() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' and new.transfer_id is null and new.account_id is not null then update public.accounts set current_balance = current_balance + case when new.transaction_type = 'income' then new.amount else -new.amount end where id = new.account_id; end if;
  if tg_op = 'DELETE' and old.transfer_id is null and old.account_id is not null then update public.accounts set current_balance = current_balance - case when old.transaction_type = 'income' then old.amount else -old.amount end where id = old.account_id; end if;
  if tg_op = 'UPDATE' and old.transfer_id is null and new.transfer_id is null then
    if old.account_id is not null then update public.accounts set current_balance = current_balance - case when old.transaction_type = 'income' then old.amount else -old.amount end where id = old.account_id; end if;
    if new.account_id is not null then update public.accounts set current_balance = current_balance + case when new.transaction_type = 'income' then new.amount else -new.amount end where id = new.account_id; end if;
  end if;
  return coalesce(new, old);
end; $$;
drop trigger if exists transaction_balance_trigger on public.transactions;
create trigger transaction_balance_trigger after insert or update or delete on public.transactions for each row execute procedure public.apply_transaction_balance();
