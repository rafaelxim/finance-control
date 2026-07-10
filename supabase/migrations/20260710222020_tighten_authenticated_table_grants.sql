revoke all privileges on public.profiles from anon, authenticated;
revoke all privileges on public.monthly_budgets from anon, authenticated;
revoke all privileges on public.budget_categories from anon, authenticated;
revoke all privileges on public.expenses from anon, authenticated;
revoke all privileges on public.balance_snapshots from anon, authenticated;
revoke all privileges on public.balance_items from anon, authenticated;
revoke all privileges on public.visual_preferences from anon, authenticated;

grant select, insert, update, delete on public.profiles to authenticated, service_role;
grant select, insert, update, delete on public.monthly_budgets to authenticated, service_role;
grant select, insert, update, delete on public.budget_categories to authenticated, service_role;
grant select, insert, update, delete on public.expenses to authenticated, service_role;
grant select, insert, update, delete on public.balance_snapshots to authenticated, service_role;
grant select, insert, update, delete on public.balance_items to authenticated, service_role;
grant select, insert, update, delete on public.visual_preferences to authenticated, service_role;
