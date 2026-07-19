create table if not exists public.financial_goals (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, category text not null check (category in ('Emergency Fund','House','Car','Education','Retirement','Vacation','Investment')),
  goal_amount numeric not null check (goal_amount > 0), current_amount numeric not null default 0 check (current_amount >= 0),
  monthly_contribution numeric not null default 0 check (monthly_contribution >= 0), target_date date, completed_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.goal_contributions (
  id uuid primary key default gen_random_uuid(), goal_id uuid not null references public.financial_goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, amount numeric not null check (amount > 0), note text, contributed_at timestamptz not null default now()
);
alter table public.financial_goals enable row level security; alter table public.goal_contributions enable row level security;
create policy "goals are private" on public.financial_goals for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "goal contributions are private" on public.goal_contributions for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create or replace function public.add_goal_contribution(p_goal_id uuid,p_amount numeric,p_note text default null) returns public.financial_goals language plpgsql security definer set search_path=public as $$
declare result public.financial_goals; begin
  update public.financial_goals set current_amount=current_amount+p_amount,completed_at=case when current_amount+p_amount>=goal_amount then now() else completed_at end where id=p_goal_id and user_id=auth.uid() returning * into result;
  if result.id is null then raise exception 'Goal not found'; end if;
  insert into public.goal_contributions(goal_id,user_id,amount,note) values(p_goal_id,auth.uid(),p_amount,p_note); return result;
end; $$;
