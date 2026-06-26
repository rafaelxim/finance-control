# Quickstart: Migrar Persistencia Remota

## Prerequisites

- Node dependencies installed with the project package manager.
- Supabase CLI available for local schema workflow.
- Docker available if using local Supabase stack or `supabase db pull`.
- Supabase project access configured for project
  `fimprjbonudybnxbdaac`.
- Browser client uses the project URL
  `https://fimprjbonudybnxbdaac.supabase.co` and an enabled publishable key.
- `backup.json` exists at the repository root.

## Setup Checks

Supabase CLI is installed as a project dev dependency and should be invoked from
the repository root with:

```bash
HOME=/tmp DO_NOT_TRACK=1 ./node_modules/.bin/supabase --version
```

Expected version during this implementation: `2.108.0`.

Baseline remote advisors before applying this feature's schema:

- Security advisors: no lints returned by Supabase MCP.
- Performance advisors: no lints returned by Supabase MCP.

1. Confirm the active feature:

   ```bash
   cat .specify/feature.json
   ```

   Expected: `specs/004-migrate-supabase-storage`.

2. Confirm the backup payload counts:

   ```bash
   jq '{schemaVersion, counts: {monthlyBudgets: (.monthlyBudgets|length), budgetCategories: (.budgetCategories|length), expenses: (.expenses|length), balanceSnapshots: (.balanceSnapshots|length), balanceItems: (.balanceItems|length), hasProfile: (.profile != null)}}' backup.json
   ```

   Expected: schema version 1, counts 3/16/7/2/6, and no profile.

## Schema Validation

Applied remote migrations through Supabase MCP on 2026-06-26:

- `init_finance_remote_schema`
- `tighten_no_auth_policy_expressions`
- `optimize_no_auth_policy_initplans`
- `drop_unused_category_status_index`

After implementing schema migrations:

1. Run local schema reset or migration application according to the Supabase CLI
   workflow chosen in tasks.
2. Verify required tables, constraints, grants, and RLS against
   [supabase-schema-contract.md](./contracts/supabase-schema-contract.md).
3. Run Supabase advisors:

   ```bash
   supabase db advisors
   ```

   If the CLI version does not support this command, use the configured MCP
   advisors for security and performance.

Expected:
- All required tables exist.
- Security advisors have no unresolved RLS/exposure findings.
- Performance advisors have no WARN-level findings for RLS policy initplans.
- Performance advisors may show INFO-level `unused_index` entries immediately
  after schema creation or seed because the remote workload has not yet
  accumulated index usage stats.

## Migration Validation

After implementing the backup migration path:

1. Start from an empty remote dataset or disposable development database.
2. Run the backup migration from `backup.json`.
3. Verify counts:

   ```text
   monthly budgets: 3
   budget categories: 16
   expenses: 7
   balance snapshots: 2
   balance items: 6
   ```

4. Run the migration a second time.
5. Verify counts remain unchanged.
6. Verify expenses still reference existing budgets and categories.
7. Verify balance items still reference existing snapshots.

Expected:
- No duplicate rows after retry.
- All references remain valid.
- Migration failure is reported if validation or verification fails.

Implemented runner:

```bash
pnpm run migrate:backup
```

Observed remote result on 2026-06-26:

```json
{
  "counts": {
    "monthlyBudgets": 3,
    "budgetCategories": 16,
    "expenses": 7,
    "balanceSnapshots": 2,
    "balanceItems": 6
  }
}
```

Supabase MCP table counts after seed: 3 monthly budgets, 16 categories, 7
expenses, 2 balance snapshots, 6 balance items, and 1 visual preferences row.

Final advisor status on 2026-06-26 after all remote migrations and backup seed:

- Security advisors: no lints.
- Performance advisors: no lints.

## Application Validation

Run quality checks:

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run build
```

Run end-to-end coverage:

```bash
npm run test:e2e
```

For the basic migration smoke scope used in this implementation pass:

```bash
npm run test:e2e:basic
```

Expected app behavior:
- The user can open dashboard, orcamento, despesas, balanco, evolucao,
  configuracoes, export, and import without signing in.
- Clearing browser-local finance data does not remove migrated remote records.
- A full reload preserves migrated records.
- Export produces the user-owned finance data needed for a full restore.
- Remote read/write failures show recoverable existing error-state patterns.

## Manual Smoke Test

1. Open the app in a clean browser context.
2. Confirm no login appears.
3. Visit each primary route.
4. Create or edit a budget/category/expense and reload.
5. Create or edit a balance snapshot/item and reload.
6. Export data from settings.
7. Confirm exported records include the migrated data.

Expected:
- All changes persist remotely after reload.
- UI terminology, navigation, BRL formatting, loading states, empty states, and
  error surfaces remain consistent with the current app.
