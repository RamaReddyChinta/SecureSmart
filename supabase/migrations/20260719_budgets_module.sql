alter table public.budgets
  add column if not exists period text not null default 'monthly' check (period in ('monthly','yearly')),
  add column if not exists name text,
  add column if not exists rollover_enabled boolean not null default false,
  add column if not exists carry_forward numeric not null default 0,
  add column if not exists template_name text;
alter table public.budgets drop constraint if exists budgets_user_id_category_id_month_key;
create unique index if not exists budgets_user_category_period_month_idx on public.budgets (user_id, category_id, period, month);
