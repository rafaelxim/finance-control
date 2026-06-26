create table public.profiles (
  id text primary key,
  display_name text,
  currency text not null default 'BRL' check (currency = 'BRL'),
  active_month text not null check (active_month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  theme_mode text not null check (theme_mode in ('light', 'dark', 'system')),
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table public.monthly_budgets (
  id text primary key,
  month text not null unique check (month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  available_amount text not null check (available_amount ~ '^\d+(\.\d+)?$'),
  notes text,
  status text not null check (status in ('draft', 'active', 'closed')),
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table public.budget_categories (
  id text primary key,
  budget_id text not null references public.monthly_budgets(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  allocation_type text not null check (allocation_type in ('fixed', 'percentage')),
  allocation_value text not null check (allocation_value ~ '^\d+(\.\d+)?$'),
  computed_limit text not null check (computed_limit ~ '^-?\d+(\.\d+)?$'),
  sort_order integer not null check (sort_order >= 0),
  status text not null check (status in ('active', 'archived')),
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table public.expenses (
  id text primary key,
  budget_id text not null references public.monthly_budgets(id) on delete cascade,
  category_id text not null references public.budget_categories(id) on delete restrict,
  amount text not null check (amount ~ '^\d+(\.\d+)?$' and amount::numeric > 0),
  date text not null check (date ~ '^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$'),
  description text,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table public.balance_snapshots (
  id text primary key,
  month text not null unique check (month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  notes text,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table public.balance_items (
  id text primary key,
  snapshot_id text not null references public.balance_snapshots(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  kind text not null check (kind in ('asset', 'debt')),
  amount text not null check (amount ~ '^-?\d+(\.\d+)?$'),
  institution text,
  notes text,
  sort_order integer not null check (sort_order >= 0),
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table public.visual_preferences (
  id text primary key,
  category_visuals jsonb not null default '{}'::jsonb,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index budget_categories_budget_id_sort_order_idx
  on public.budget_categories (budget_id, sort_order);
create index budget_categories_status_idx on public.budget_categories (status);
create index expenses_budget_id_date_idx on public.expenses (budget_id, date desc);
create index expenses_category_id_idx on public.expenses (category_id);
create index balance_items_snapshot_id_sort_order_idx
  on public.balance_items (snapshot_id, sort_order);
create index balance_snapshots_month_idx on public.balance_snapshots (month);

grant select, insert, update, delete on public.profiles to anon, service_role;
grant select, insert, update, delete on public.monthly_budgets to anon, service_role;
grant select, insert, update, delete on public.budget_categories to anon, service_role;
grant select, insert, update, delete on public.expenses to anon, service_role;
grant select, insert, update, delete on public.balance_snapshots to anon, service_role;
grant select, insert, update, delete on public.balance_items to anon, service_role;
grant select, insert, update, delete on public.visual_preferences to anon, service_role;

alter table public.profiles enable row level security;
alter table public.monthly_budgets enable row level security;
alter table public.budget_categories enable row level security;
alter table public.expenses enable row level security;
alter table public.balance_snapshots enable row level security;
alter table public.balance_items enable row level security;
alter table public.visual_preferences enable row level security;

create policy "anon can read profiles"
  on public.profiles for select to anon using (true);
create policy "anon can insert profiles"
  on public.profiles for insert to anon with check (true);
create policy "anon can update profiles"
  on public.profiles for update to anon using (true) with check (true);
create policy "anon can delete profiles"
  on public.profiles for delete to anon using (true);

create policy "anon can read monthly budgets"
  on public.monthly_budgets for select to anon using (true);
create policy "anon can insert monthly budgets"
  on public.monthly_budgets for insert to anon with check (true);
create policy "anon can update monthly budgets"
  on public.monthly_budgets for update to anon using (true) with check (true);
create policy "anon can delete monthly budgets"
  on public.monthly_budgets for delete to anon using (true);

create policy "anon can read budget categories"
  on public.budget_categories for select to anon using (true);
create policy "anon can insert budget categories"
  on public.budget_categories for insert to anon with check (true);
create policy "anon can update budget categories"
  on public.budget_categories for update to anon using (true) with check (true);
create policy "anon can delete budget categories"
  on public.budget_categories for delete to anon using (true);

create policy "anon can read expenses"
  on public.expenses for select to anon using (true);
create policy "anon can insert expenses"
  on public.expenses for insert to anon with check (true);
create policy "anon can update expenses"
  on public.expenses for update to anon using (true) with check (true);
create policy "anon can delete expenses"
  on public.expenses for delete to anon using (true);

create policy "anon can read balance snapshots"
  on public.balance_snapshots for select to anon using (true);
create policy "anon can insert balance snapshots"
  on public.balance_snapshots for insert to anon with check (true);
create policy "anon can update balance snapshots"
  on public.balance_snapshots for update to anon using (true) with check (true);
create policy "anon can delete balance snapshots"
  on public.balance_snapshots for delete to anon using (true);

create policy "anon can read balance items"
  on public.balance_items for select to anon using (true);
create policy "anon can insert balance items"
  on public.balance_items for insert to anon with check (true);
create policy "anon can update balance items"
  on public.balance_items for update to anon using (true) with check (true);
create policy "anon can delete balance items"
  on public.balance_items for delete to anon using (true);

create policy "anon can read visual preferences"
  on public.visual_preferences for select to anon using (true);
create policy "anon can insert visual preferences"
  on public.visual_preferences for insert to anon with check (true);
create policy "anon can update visual preferences"
  on public.visual_preferences for update to anon using (true) with check (true);
create policy "anon can delete visual preferences"
  on public.visual_preferences for delete to anon using (true);
