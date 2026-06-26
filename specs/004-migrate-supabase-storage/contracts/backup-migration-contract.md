# Contract: Backup Migration

## Purpose

Define the migration behavior for loading `backup.json` into the remote
Supabase-backed dataset.

## Source

`backup.json` at the repository root is the authoritative migration source for
this feature.

Current expected payload:
- `schemaVersion`: 1
- `monthlyBudgets`: 3
- `budgetCategories`: 16
- `expenses`: 7
- `balanceSnapshots`: 2
- `balanceItems`: 6
- `profile`: null
- `visualPreferences`: empty object

## Preconditions

- Remote schema exists and required constraints are applied.
- Backup payload validates against the existing export schema.
- Reference checks pass for all categories, expenses, and balance items.
- The migration process can authenticate only with credentials appropriate to
  its runtime. Browser code must not use secret/service-role credentials.

## Migration Order

1. Validate full payload shape and references.
2. Upsert profile or apply default-profile handling when profile is null.
3. Upsert visual preferences.
4. Upsert monthly budgets.
5. Upsert budget categories.
6. Upsert expenses.
7. Upsert balance snapshots.
8. Upsert balance items.
9. Verify counts and references.

## Idempotency

- Primary-key upserts must make repeated migration runs safe.
- Re-running the same backup must leave final counts unchanged.
- Existing rows with matching IDs may be updated only to the values from the
  source payload during the controlled migration run.
- Migration verification must fail if duplicate month records or duplicate
  primary keys are detected.

## Success Result

Migration is successful only when:
- All expected counts match.
- All foreign-key relationships are valid.
- Dashboard, budget, expense, balance, evolution, settings, export, and import
  flows can read the migrated data without local IndexedDB state.

## Failure Result

Migration fails when:
- Backup schema validation fails.
- Reference validation fails.
- Any remote write fails.
- Verification counts or relationships do not match.

Failure must be visible to the developer/operator and must not be presented as a
successful migration in the UI or quickstart checks.

## Implementation Validation

- `src/storage/supabase/backup-migration.ts` validates the existing export
  schema and references before remote writes.
- `scripts/migrate-backup-to-supabase.ts` loads `.env`, reads `backup.json`, and
  runs the idempotent migration.
- Integration tests cover expected counts, retry idempotency, and missing
  budget/category/snapshot references.
- The remote Supabase project was seeded successfully with the expected
  3/16/7/2/6 entity counts on 2026-06-26.
- No contract deviations are currently recorded.
