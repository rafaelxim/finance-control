create index if not exists budget_categories_budget_id_user_id_idx
  on public.budget_categories(budget_id, user_id);

create index if not exists expenses_budget_id_user_id_idx
  on public.expenses(budget_id, user_id);

create index if not exists expenses_category_id_user_id_idx
  on public.expenses(category_id, user_id);

create index if not exists balance_items_snapshot_id_user_id_idx
  on public.balance_items(snapshot_id, user_id);
