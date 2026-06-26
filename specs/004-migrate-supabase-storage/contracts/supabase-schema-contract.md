# Contract: Supabase Schema

## Purpose

Define the database behavior required for the remote persistence migration. This
contract is fulfilled by Supabase migrations and verified through Supabase
advisors plus targeted SQL checks.

## Required Tables

The public schema must contain tables for:
- `profiles`
- `monthly_budgets`
- `budget_categories`
- `expenses`
- `balance_snapshots`
- `balance_items`
- `visual_preferences`

Naming may use snake_case in the database, but repository mappers must preserve
the existing application/domain field names.

## Required Constraints

- Every table has a stable text primary key compatible with existing exported
  IDs.
- `monthly_budgets.month` is unique.
- `balance_snapshots.month` is unique.
- `budget_categories.budget_id` references `monthly_budgets.id`.
- `expenses.budget_id` references `monthly_budgets.id`.
- `expenses.category_id` references `budget_categories.id`.
- `balance_items.snapshot_id` references `balance_snapshots.id`.
- Status and kind fields are constrained to existing domain enum values.
- Month keys, dates, timestamps, sort orders, and money fields are constrained
  enough to reject invalid backup data before it becomes accepted remote data.

## Data API Access

- Tables exposed to the app must grant the required `select`, `insert`,
  `update`, and `delete` privileges to the anonymous client role for this
  no-auth phase.
- Tables must grant the required privileges to service/admin roles for
  migration and operational verification.
- Because new Supabase tables may not be exposed automatically, migrations must
  include explicit grants rather than relying on dashboard defaults.

## RLS

- Row Level Security must be enabled on every exposed table.
- Policies must be explicit for the no-auth single-user phase.
- Policies must avoid `auth.role()` checks and prefer role-targeted policy
  clauses.
- Policies must include both `USING` and `WITH CHECK` where updates or inserts
  need write validation.
- The plan accepts that this phase is a single shared data space until a future
  authentication feature adds per-user ownership.

## Verification

After applying schema changes:
- `mcp__supabase.list_tables` or equivalent SQL shows all required tables and
  foreign keys.
- Supabase security advisors return no unresolved RLS or exposure findings.
- Supabase performance advisors return no unresolved index findings for the
  expected query paths.
- Direct anonymous-client checks can select, insert, update, and delete a
  disposable row in a dependency-safe test transaction or test environment.
