# Contract: Remote Repository Boundary

## Purpose

Define the application-facing behavior that must remain stable while the
implementation changes from IndexedDB/Dexie to Supabase.

## General Rules

- Stores continue calling repository functions rather than using Supabase
  directly.
- Domain objects returned by repositories keep the existing TypeScript shapes.
- Repository functions throw or return existing error patterns that pages can
  surface through current form/error components.
- Repository functions preserve existing sorting behavior.
- Monetary values remain stable decimal strings at the app boundary.
- Timestamps and IDs are preserved on migrated records and generated for new
  records using existing app conventions unless the final implementation
  deliberately centralizes timestamp generation remotely.

## Budget Repository

Required capabilities:
- Load a budget by month with its categories in display order.
- Save a budget and its category set.
- Preserve category archive/history behavior for previous months.

Remote query expectations:
- Month-scoped budget lookup.
- Category lookup by `budget_id` ordered by `sort_order`.
- Upsert or transactional write behavior that prevents partial budget/category
  saves.

## Expense Repository

Required capabilities:
- Load expenses by budget.
- Load expenses by month.
- Save an expense.
- Delete an expense.
- Resolve the budget for an expense month.

Remote query expectations:
- Expense lookup by `budget_id` ordered consistently with existing lists.
- Expense lookup by month through its budget relationship.
- Writes fail when budget/category references are invalid.

## Balance Repository

Required capabilities:
- Load a snapshot by month with ordered items.
- Load latest snapshot with items.
- Save a snapshot and its item set.
- Delete a balance item.
- Load balance history for evolution views.

Remote query expectations:
- Snapshot lookup by month.
- Item lookup by `snapshot_id` ordered by `sort_order`.
- History lookup ordered by month.

## Profile and Preferences

Required capabilities:
- Load or create default profile behavior when the profile is absent.
- Persist active month/theme preferences.
- Persist visual preferences currently included in export/import.

Remote query expectations:
- Missing rows map to existing defaults.
- Singleton preference records are idempotent.

## Export/Import

Required capabilities:
- Export all remote user-owned financial data into the existing backup payload
  shape.
- Import a valid payload into remote storage.
- Validate schema and references before accepting an import as complete.
- Preserve current e2e export/import behavior, now backed by remote data.

## Failure Behavior

- Read failure: page shows existing recoverable error state.
- Write failure: form/list remains consistent and allows retry.
- Migration failure: no partial import is reported as successful.
- Remote empty state: pages show existing empty states without recreating old
  IndexedDB data.

## Implementation Validation

- Budget, expense, balance, profile/preferences, and export/import repository
  contract tests are implemented under `tests/integration/storage/`.
- Runtime repository imports no longer depend on Dexie/IndexedDB.
- Supabase client initialization uses only `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_PUBLISHABLE_KEY`.
- No contract deviations are currently recorded.
