alter policy "anon can read profiles" on public.profiles using ((select auth.role()) = 'anon');
alter policy "anon can insert profiles" on public.profiles with check ((select auth.role()) = 'anon');
alter policy "anon can update profiles" on public.profiles using ((select auth.role()) = 'anon') with check ((select auth.role()) = 'anon');
alter policy "anon can delete profiles" on public.profiles using ((select auth.role()) = 'anon');

alter policy "anon can read monthly budgets" on public.monthly_budgets using ((select auth.role()) = 'anon');
alter policy "anon can insert monthly budgets" on public.monthly_budgets with check ((select auth.role()) = 'anon');
alter policy "anon can update monthly budgets" on public.monthly_budgets using ((select auth.role()) = 'anon') with check ((select auth.role()) = 'anon');
alter policy "anon can delete monthly budgets" on public.monthly_budgets using ((select auth.role()) = 'anon');

alter policy "anon can read budget categories" on public.budget_categories using ((select auth.role()) = 'anon');
alter policy "anon can insert budget categories" on public.budget_categories with check ((select auth.role()) = 'anon');
alter policy "anon can update budget categories" on public.budget_categories using ((select auth.role()) = 'anon') with check ((select auth.role()) = 'anon');
alter policy "anon can delete budget categories" on public.budget_categories using ((select auth.role()) = 'anon');

alter policy "anon can read expenses" on public.expenses using ((select auth.role()) = 'anon');
alter policy "anon can insert expenses" on public.expenses with check ((select auth.role()) = 'anon');
alter policy "anon can update expenses" on public.expenses using ((select auth.role()) = 'anon') with check ((select auth.role()) = 'anon');
alter policy "anon can delete expenses" on public.expenses using ((select auth.role()) = 'anon');

alter policy "anon can read balance snapshots" on public.balance_snapshots using ((select auth.role()) = 'anon');
alter policy "anon can insert balance snapshots" on public.balance_snapshots with check ((select auth.role()) = 'anon');
alter policy "anon can update balance snapshots" on public.balance_snapshots using ((select auth.role()) = 'anon') with check ((select auth.role()) = 'anon');
alter policy "anon can delete balance snapshots" on public.balance_snapshots using ((select auth.role()) = 'anon');

alter policy "anon can read balance items" on public.balance_items using ((select auth.role()) = 'anon');
alter policy "anon can insert balance items" on public.balance_items with check ((select auth.role()) = 'anon');
alter policy "anon can update balance items" on public.balance_items using ((select auth.role()) = 'anon') with check ((select auth.role()) = 'anon');
alter policy "anon can delete balance items" on public.balance_items using ((select auth.role()) = 'anon');

alter policy "anon can read visual preferences" on public.visual_preferences using ((select auth.role()) = 'anon');
alter policy "anon can insert visual preferences" on public.visual_preferences with check ((select auth.role()) = 'anon');
alter policy "anon can update visual preferences" on public.visual_preferences using ((select auth.role()) = 'anon') with check ((select auth.role()) = 'anon');
alter policy "anon can delete visual preferences" on public.visual_preferences using ((select auth.role()) = 'anon');
