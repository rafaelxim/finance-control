# Local Data Contract: Controle Financeiro Gamificado

## Purpose

Defines the persisted local data shape and import/export boundaries for the
browser-only first version. Implementation may use IndexedDB tables, but tests
must verify this contract at the app boundary.

## Persistence Rules

- Data is stored locally in the browser.
- Monetary values are persisted as decimal strings, not floating-point numbers.
- Every persisted record has `id`, `createdAt`, and `updatedAt` unless it is a
  derived read model.
- Records that reference another record must fail validation if the referenced
  record is missing.
- Deleting or archiving display entities must not silently delete historical
  financial records.

## Indexed Collections

### `profiles`

Primary index: `id`

Required fields:

- `id`
- `currency`
- `activeMonth`
- `themeMode`
- `createdAt`
- `updatedAt`

### `monthlyBudgets`

Primary index: `id`

Secondary indexes:

- `month`
- `status`

Required fields:

- `id`
- `month`
- `availableAmount`
- `status`
- `createdAt`
- `updatedAt`

### `budgetCategories`

Primary index: `id`

Secondary indexes:

- `budgetId`
- `[budgetId+sortOrder]`
- `status`

Required fields:

- `id`
- `budgetId`
- `name`
- `allocationType`
- `allocationValue`
- `computedLimit`
- `sortOrder`
- `status`
- `createdAt`
- `updatedAt`

### `expenses`

Primary index: `id`

Secondary indexes:

- `budgetId`
- `categoryId`
- `date`
- `[budgetId+date]`

Required fields:

- `id`
- `budgetId`
- `categoryId`
- `amount`
- `date`
- `createdAt`
- `updatedAt`

### `balanceSnapshots`

Primary index: `id`

Secondary indexes:

- `month`

Required fields:

- `id`
- `month`
- `createdAt`
- `updatedAt`

### `balanceItems`

Primary index: `id`

Secondary indexes:

- `snapshotId`
- `kind`
- `[snapshotId+sortOrder]`

Required fields:

- `id`
- `snapshotId`
- `name`
- `kind`
- `amount`
- `sortOrder`

## Export JSON Contract

```json
{
  "schemaVersion": 1,
  "exportedAt": "2026-06-21T00:00:00.000Z",
  "profile": {
    "id": "local-user",
    "currency": "BRL",
    "activeMonth": "2026-06",
    "themeMode": "system",
    "createdAt": "2026-06-21T00:00:00.000Z",
    "updatedAt": "2026-06-21T00:00:00.000Z"
  },
  "monthlyBudgets": [],
  "budgetCategories": [],
  "expenses": [],
  "balanceSnapshots": [],
  "balanceItems": [],
  "visualPreferences": {}
}
```

## Import Validation Contract

Before applying imported data, the app must validate:

- `schemaVersion` is supported.
- All required arrays exist.
- Decimal strings are valid and finite.
- Month keys use `YYYY-MM`.
- Expense references point to existing budgets and categories.
- Category references point to existing budgets.
- Balance items point to existing snapshots.
- Credit card balance items are treated as debts.
- Visual preferences use supported local theme values.

## Backup Boundary

Export/import handles financial data and visual preferences only. It must not
embed decorative media or external brand assets.
