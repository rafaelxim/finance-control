# Data Model: Migrar Persistencia Remota

## Overview

The remote model mirrors the existing exported finance data so that
`backup.json` can be migrated without changing user-visible behavior. Database
rows preserve existing string IDs, timestamps, month keys, decimal-string money
values at the application boundary, ordering, statuses, and references.

## User Profile

Represents user-level preferences. The backup may omit this entity.

Fields:
- `id`: stable string identifier, primary key
- `displayName`: optional display name
- `currency`: `BRL`
- `activeMonth`: month key in `YYYY-MM`
- `themeMode`: `light`, `dark`, or `system`
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp

Validation:
- `currency` must be `BRL`
- `activeMonth` must be a valid month key
- Missing profile falls back to current default profile behavior

Relationships:
- No required parent or child references

## Monthly Budget

Represents one monthly financial plan.

Fields:
- `id`: stable string identifier, primary key
- `month`: month key in `YYYY-MM`, unique
- `availableAmount`: non-negative decimal string
- `notes`: optional text
- `status`: `draft`, `active`, or `closed`
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp

Validation:
- One budget per month
- Amount must be non-negative
- Status must be one of the existing budget statuses

Relationships:
- Has many Budget Categories
- Has many Expenses

## Budget Category

Represents a category allocation inside a monthly budget.

Fields:
- `id`: stable string identifier, primary key
- `budgetId`: Monthly Budget identifier
- `name`: required text
- `allocationType`: `fixed` or `percentage`
- `allocationValue`: non-negative decimal string
- `computedLimit`: decimal string produced by existing allocation rules
- `sortOrder`: non-negative integer
- `status`: `active` or `archived`
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp

Validation:
- `budgetId` must reference an existing Monthly Budget
- `name` is required
- `allocationValue` is non-negative
- `sortOrder` is non-negative

Relationships:
- Belongs to Monthly Budget
- Has many Expenses

## Expense

Represents a spending record.

Fields:
- `id`: stable string identifier, primary key
- `budgetId`: Monthly Budget identifier
- `categoryId`: Budget Category identifier
- `amount`: positive decimal string
- `date`: calendar date in `YYYY-MM-DD`
- `description`: optional text
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp

Validation:
- `budgetId` must reference an existing Monthly Budget
- `categoryId` must reference an existing Budget Category
- `amount` must be positive
- `date` must be a valid calendar date string

Relationships:
- Belongs to Monthly Budget
- Belongs to Budget Category

## Balance Snapshot

Represents the user's patrimony snapshot for a month.

Fields:
- `id`: stable string identifier, primary key
- `month`: month key in `YYYY-MM`, unique
- `notes`: optional text
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp

Validation:
- One balance snapshot per month
- `month` must be a valid month key

Relationships:
- Has many Balance Items

## Balance Item

Represents an asset or debt in a balance snapshot.

Fields:
- `id`: stable string identifier, primary key
- `snapshotId`: Balance Snapshot identifier
- `name`: required text
- `kind`: `asset` or `debt`
- `amount`: decimal string
- `institution`: optional text
- `notes`: optional text
- `sortOrder`: non-negative integer
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp

Validation:
- `snapshotId` must reference an existing Balance Snapshot
- `name` is required
- `kind` must be `asset` or `debt`
- `amount` must be a decimal string and may be negative only if existing domain
  validation allows it for the item kind
- `sortOrder` is non-negative

Relationships:
- Belongs to Balance Snapshot

## Visual Preferences

Represents user-owned display preferences.

Fields:
- `id`: stable singleton identifier or key
- `categoryVisuals`: optional mapping from category name/id to selected visual
- `updatedAt`: ISO timestamp

Validation:
- Missing preferences default to an empty object
- Decorative media or external assets remain outside the backup boundary

Relationships:
- May reference categories by stable keys, but must not block migration when the
  current backup has no visual preferences

## Backup Payload

Represents the portable migration source.

Fields:
- `schemaVersion`: currently `1`
- `exportedAt`: ISO timestamp
- `profile`: User Profile or null
- `monthlyBudgets`: Monthly Budget records
- `budgetCategories`: Budget Category records
- `expenses`: Expense records
- `balanceSnapshots`: Balance Snapshot records
- `balanceItems`: Balance Item records
- `visualPreferences`: Visual Preferences object

Validation:
- Validate shape and references before accepting migration as complete
- Reject duplicate budget months and duplicate balance snapshot months
- Preserve current backup counts after migration: 3 budgets, 16 categories, 7
  expenses, 2 balance snapshots, 6 balance items, profile null, empty visual
  preferences

## State Transitions

Migration:
- `not_started` -> `validated` after backup schema and references pass
- `validated` -> `applied` after all dependency-ordered upserts complete
- `applied` -> `verified` after counts and relationship checks match expected
  values
- Any state -> `failed` when validation, write, or verification fails

Budget:
- Existing `draft`, `active`, and `closed` statuses remain unchanged

Category:
- Existing `active` and `archived` statuses remain unchanged

Remote operation:
- `idle` -> `loading` -> `ready`
- `idle` or `ready` -> `saving` -> `ready`
- Any remote operation -> `error` with retry available
