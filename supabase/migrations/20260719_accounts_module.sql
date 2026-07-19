alter table public.accounts
  add column if not exists opening_balance numeric not null default 0,
  add column if not exists current_balance numeric not null default 0,
  add column if not exists currency text not null default 'INR',
  add column if not exists icon text not null default '🏦',
  add column if not exists include_in_net_worth boolean not null default true,
  add column if not exists is_active boolean not null default true;
update public.accounts set opening_balance = balance, current_balance = balance where current_balance = 0 and balance <> 0;
alter table public.accounts drop column if exists balance;
alter table public.accounts add constraint accounts_type_check check (type in ('Bank', 'Cash', 'Wallet', 'Credit Card', 'Investment', 'Savings'));
