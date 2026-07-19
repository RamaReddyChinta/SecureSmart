create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now()
);
create table public.accounts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, type text not null, balance numeric not null default 0, color text, created_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, icon text, color text, type text not null check (type in ('income','expense'))
);
create table public.transactions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null, category_id uuid references public.categories(id) on delete set null,
  amount numeric not null check (amount > 0), transaction_type text not null check (transaction_type in ('income','expense')),
  notes text, date date not null default current_date, created_at timestamptz not null default now()
);
create table public.budgets (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade, monthly_limit numeric not null check (monthly_limit >= 0),
  month date not null, unique (user_id, category_id, month)
);
alter table public.profiles enable row level security; alter table public.accounts enable row level security; alter table public.categories enable row level security; alter table public.transactions enable row level security; alter table public.budgets enable row level security;
create policy "profiles are private" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "accounts are private" on public.accounts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "categories are private" on public.categories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions are private" on public.transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "budgets are private" on public.budgets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create or replace function public.create_profile() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, full_name, email, avatar_url) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email, new.raw_user_meta_data->>'avatar_url') on conflict (id) do nothing; return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.create_profile();
