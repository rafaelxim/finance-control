do $$
declare
  admin_user_id uuid := '51b0b054-471c-4887-a66e-ab38fb16f336';
begin
  if not exists (select 1 from auth.users where id = admin_user_id) then
    raise exception 'Admin user % was not found in auth.users', admin_user_id;
  end if;
end $$;

alter table public.profiles
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.monthly_budgets
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.budget_categories
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.expenses
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.balance_snapshots
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.balance_items
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.visual_preferences
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();

update public.profiles set user_id = '51b0b054-471c-4887-a66e-ab38fb16f336' where user_id is null;
update public.monthly_budgets set user_id = '51b0b054-471c-4887-a66e-ab38fb16f336' where user_id is null;
update public.budget_categories set user_id = '51b0b054-471c-4887-a66e-ab38fb16f336' where user_id is null;
update public.expenses set user_id = '51b0b054-471c-4887-a66e-ab38fb16f336' where user_id is null;
update public.balance_snapshots set user_id = '51b0b054-471c-4887-a66e-ab38fb16f336' where user_id is null;
update public.balance_items set user_id = '51b0b054-471c-4887-a66e-ab38fb16f336' where user_id is null;
update public.visual_preferences set user_id = '51b0b054-471c-4887-a66e-ab38fb16f336' where user_id is null;

alter table public.profiles alter column user_id set not null;
alter table public.monthly_budgets alter column user_id set not null;
alter table public.budget_categories alter column user_id set not null;
alter table public.expenses alter column user_id set not null;
alter table public.balance_snapshots alter column user_id set not null;
alter table public.balance_items alter column user_id set not null;
alter table public.visual_preferences alter column user_id set not null;

alter table public.monthly_budgets drop constraint if exists monthly_budgets_month_key;
alter table public.balance_snapshots drop constraint if exists balance_snapshots_month_key;

alter table public.profiles drop constraint if exists profiles_user_id_key;
alter table public.monthly_budgets drop constraint if exists monthly_budgets_user_id_month_key;
alter table public.monthly_budgets drop constraint if exists monthly_budgets_id_user_id_key;
alter table public.budget_categories drop constraint if exists budget_categories_id_user_id_key;
alter table public.balance_snapshots drop constraint if exists balance_snapshots_user_id_month_key;
alter table public.balance_snapshots drop constraint if exists balance_snapshots_id_user_id_key;
alter table public.visual_preferences drop constraint if exists visual_preferences_user_id_key;

alter table public.profiles add constraint profiles_user_id_key unique (user_id);
alter table public.monthly_budgets add constraint monthly_budgets_user_id_month_key unique (user_id, month);
alter table public.monthly_budgets add constraint monthly_budgets_id_user_id_key unique (id, user_id);
alter table public.budget_categories add constraint budget_categories_id_user_id_key unique (id, user_id);
alter table public.balance_snapshots add constraint balance_snapshots_user_id_month_key unique (user_id, month);
alter table public.balance_snapshots add constraint balance_snapshots_id_user_id_key unique (id, user_id);
alter table public.visual_preferences add constraint visual_preferences_user_id_key unique (user_id);

alter table public.budget_categories drop constraint if exists budget_categories_budget_user_id_fkey;
alter table public.expenses drop constraint if exists expenses_budget_user_id_fkey;
alter table public.expenses drop constraint if exists expenses_category_user_id_fkey;
alter table public.balance_items drop constraint if exists balance_items_snapshot_user_id_fkey;

alter table public.budget_categories
  add constraint budget_categories_budget_user_id_fkey
  foreign key (budget_id, user_id)
  references public.monthly_budgets(id, user_id)
  on delete cascade;

alter table public.expenses
  add constraint expenses_budget_user_id_fkey
  foreign key (budget_id, user_id)
  references public.monthly_budgets(id, user_id)
  on delete cascade;

alter table public.expenses
  add constraint expenses_category_user_id_fkey
  foreign key (category_id, user_id)
  references public.budget_categories(id, user_id)
  on delete restrict;

alter table public.balance_items
  add constraint balance_items_snapshot_user_id_fkey
  foreign key (snapshot_id, user_id)
  references public.balance_snapshots(id, user_id)
  on delete cascade;

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists monthly_budgets_user_id_month_idx on public.monthly_budgets(user_id, month);
create index if not exists budget_categories_user_id_budget_id_sort_order_idx
  on public.budget_categories(user_id, budget_id, sort_order);
create index if not exists expenses_user_id_budget_id_date_idx
  on public.expenses(user_id, budget_id, date desc);
create index if not exists expenses_user_id_category_id_idx
  on public.expenses(user_id, category_id);
create index if not exists balance_snapshots_user_id_month_idx
  on public.balance_snapshots(user_id, month);
create index if not exists balance_items_user_id_snapshot_id_sort_order_idx
  on public.balance_items(user_id, snapshot_id, sort_order);
create index if not exists visual_preferences_user_id_idx on public.visual_preferences(user_id);

do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profiles',
        'monthly_budgets',
        'budget_categories',
        'expenses',
        'balance_snapshots',
        'balance_items',
        'visual_preferences'
      )
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end $$;

revoke select, insert, update, delete on public.profiles from anon;
revoke select, insert, update, delete on public.monthly_budgets from anon;
revoke select, insert, update, delete on public.budget_categories from anon;
revoke select, insert, update, delete on public.expenses from anon;
revoke select, insert, update, delete on public.balance_snapshots from anon;
revoke select, insert, update, delete on public.balance_items from anon;
revoke select, insert, update, delete on public.visual_preferences from anon;

grant select, insert, update, delete on public.profiles to authenticated, service_role;
grant select, insert, update, delete on public.monthly_budgets to authenticated, service_role;
grant select, insert, update, delete on public.budget_categories to authenticated, service_role;
grant select, insert, update, delete on public.expenses to authenticated, service_role;
grant select, insert, update, delete on public.balance_snapshots to authenticated, service_role;
grant select, insert, update, delete on public.balance_items to authenticated, service_role;
grant select, insert, update, delete on public.visual_preferences to authenticated, service_role;

create policy "authenticated users manage own profiles"
  on public.profiles for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "authenticated users manage own monthly budgets"
  on public.monthly_budgets for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "authenticated users manage own budget categories"
  on public.budget_categories for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "authenticated users manage own expenses"
  on public.expenses for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "authenticated users manage own balance snapshots"
  on public.balance_snapshots for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "authenticated users manage own balance items"
  on public.balance_items for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "authenticated users manage own visual preferences"
  on public.visual_preferences for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
