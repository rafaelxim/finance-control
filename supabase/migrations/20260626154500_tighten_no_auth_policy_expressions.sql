drop policy if exists "anon can read profiles" on public.profiles;
drop policy if exists "anon can insert profiles" on public.profiles;
drop policy if exists "anon can update profiles" on public.profiles;
drop policy if exists "anon can delete profiles" on public.profiles;
drop policy if exists "anon can read monthly budgets" on public.monthly_budgets;
drop policy if exists "anon can insert monthly budgets" on public.monthly_budgets;
drop policy if exists "anon can update monthly budgets" on public.monthly_budgets;
drop policy if exists "anon can delete monthly budgets" on public.monthly_budgets;
drop policy if exists "anon can read budget categories" on public.budget_categories;
drop policy if exists "anon can insert budget categories" on public.budget_categories;
drop policy if exists "anon can update budget categories" on public.budget_categories;
drop policy if exists "anon can delete budget categories" on public.budget_categories;
drop policy if exists "anon can read expenses" on public.expenses;
drop policy if exists "anon can insert expenses" on public.expenses;
drop policy if exists "anon can update expenses" on public.expenses;
drop policy if exists "anon can delete expenses" on public.expenses;
drop policy if exists "anon can read balance snapshots" on public.balance_snapshots;
drop policy if exists "anon can insert balance snapshots" on public.balance_snapshots;
drop policy if exists "anon can update balance snapshots" on public.balance_snapshots;
drop policy if exists "anon can delete balance snapshots" on public.balance_snapshots;
drop policy if exists "anon can read balance items" on public.balance_items;
drop policy if exists "anon can insert balance items" on public.balance_items;
drop policy if exists "anon can update balance items" on public.balance_items;
drop policy if exists "anon can delete balance items" on public.balance_items;
drop policy if exists "anon can read visual preferences" on public.visual_preferences;
drop policy if exists "anon can insert visual preferences" on public.visual_preferences;
drop policy if exists "anon can update visual preferences" on public.visual_preferences;
drop policy if exists "anon can delete visual preferences" on public.visual_preferences;

create policy "anon can read profiles"
  on public.profiles for select to anon using (auth.role() = 'anon');
create policy "anon can insert profiles"
  on public.profiles for insert to anon with check (auth.role() = 'anon');
create policy "anon can update profiles"
  on public.profiles for update to anon using (auth.role() = 'anon') with check (auth.role() = 'anon');
create policy "anon can delete profiles"
  on public.profiles for delete to anon using (auth.role() = 'anon');

create policy "anon can read monthly budgets"
  on public.monthly_budgets for select to anon using (auth.role() = 'anon');
create policy "anon can insert monthly budgets"
  on public.monthly_budgets for insert to anon with check (auth.role() = 'anon');
create policy "anon can update monthly budgets"
  on public.monthly_budgets for update to anon using (auth.role() = 'anon') with check (auth.role() = 'anon');
create policy "anon can delete monthly budgets"
  on public.monthly_budgets for delete to anon using (auth.role() = 'anon');

create policy "anon can read budget categories"
  on public.budget_categories for select to anon using (auth.role() = 'anon');
create policy "anon can insert budget categories"
  on public.budget_categories for insert to anon with check (auth.role() = 'anon');
create policy "anon can update budget categories"
  on public.budget_categories for update to anon using (auth.role() = 'anon') with check (auth.role() = 'anon');
create policy "anon can delete budget categories"
  on public.budget_categories for delete to anon using (auth.role() = 'anon');

create policy "anon can read expenses"
  on public.expenses for select to anon using (auth.role() = 'anon');
create policy "anon can insert expenses"
  on public.expenses for insert to anon with check (auth.role() = 'anon');
create policy "anon can update expenses"
  on public.expenses for update to anon using (auth.role() = 'anon') with check (auth.role() = 'anon');
create policy "anon can delete expenses"
  on public.expenses for delete to anon using (auth.role() = 'anon');

create policy "anon can read balance snapshots"
  on public.balance_snapshots for select to anon using (auth.role() = 'anon');
create policy "anon can insert balance snapshots"
  on public.balance_snapshots for insert to anon with check (auth.role() = 'anon');
create policy "anon can update balance snapshots"
  on public.balance_snapshots for update to anon using (auth.role() = 'anon') with check (auth.role() = 'anon');
create policy "anon can delete balance snapshots"
  on public.balance_snapshots for delete to anon using (auth.role() = 'anon');

create policy "anon can read balance items"
  on public.balance_items for select to anon using (auth.role() = 'anon');
create policy "anon can insert balance items"
  on public.balance_items for insert to anon with check (auth.role() = 'anon');
create policy "anon can update balance items"
  on public.balance_items for update to anon using (auth.role() = 'anon') with check (auth.role() = 'anon');
create policy "anon can delete balance items"
  on public.balance_items for delete to anon using (auth.role() = 'anon');

create policy "anon can read visual preferences"
  on public.visual_preferences for select to anon using (auth.role() = 'anon');
create policy "anon can insert visual preferences"
  on public.visual_preferences for insert to anon with check (auth.role() = 'anon');
create policy "anon can update visual preferences"
  on public.visual_preferences for update to anon using (auth.role() = 'anon') with check (auth.role() = 'anon');
create policy "anon can delete visual preferences"
  on public.visual_preferences for delete to anon using (auth.role() = 'anon');
