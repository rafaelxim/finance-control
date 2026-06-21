# Data Model: Controle Financeiro Gamificado

## Overview

The app stores one local user's budgets, expenses, and monthly balance snapshots
in IndexedDB. Monetary values are
represented as decimal strings in storage to preserve precision and converted to
Decimal.js values in domain logic.

## Entity: UserProfile

Represents local application preferences for the single user.

### Fields

- `id`: stable local identifier
- `displayName`: optional display name
- `currency`: ISO currency code, default `BRL`
- `activeMonth`: month key in `YYYY-MM`
- `themeMode`: `light`, `dark`, or `system`
- `createdAt`: creation timestamp
- `updatedAt`: last update timestamp

### Validation Rules

- `currency` must be `BRL` for the first version.
- `activeMonth` must be a valid calendar month.
- Only one profile exists in the initial single-user scope.

## Entity: MonthlyBudget

Defines the spending plan for one calendar month.

### Fields

- `id`: stable identifier
- `month`: month key in `YYYY-MM`
- `availableAmount`: decimal string, greater than or equal to zero
- `notes`: optional text
- `status`: `draft`, `active`, `closed`
- `createdAt`: creation timestamp
- `updatedAt`: last update timestamp

### Relationships

- Has many `BudgetCategory`
- Has many `Expense` through categories

### Validation Rules

- Only one active budget may exist for a given month.
- `availableAmount` cannot be negative.
- A budget can be created with zero available amount, but percentage categories
  cannot allocate positive values until the amount is greater than zero.

### State Transitions

- `draft` -> `active`: user confirms the monthly setup.
- `active` -> `closed`: month is complete and kept for history.
- `closed` -> `active`: allowed only when user intentionally reopens the month.

## Entity: BudgetCategory

Defines a monthly spending bucket such as aluguel, comida, or lazer.

### Fields

- `id`: stable identifier
- `budgetId`: parent monthly budget
- `name`: user-facing category name
- `allocationType`: `fixed` or `percentage`
- `allocationValue`: decimal string; amount in BRL for `fixed`, percent for
  `percentage`
- `computedLimit`: decimal string calculated from the monthly budget
- `sortOrder`: integer for display order
- `status`: `active` or `archived`
- `createdAt`: creation timestamp
- `updatedAt`: last update timestamp

### Relationships

- Belongs to `MonthlyBudget`
- Has many `Expense`

### Validation Rules

- `name` is required and unique within the same monthly budget among active
  categories.
- `allocationValue` cannot be negative.
- Percent allocation must be between `0` and `100`.
- Fixed allocation must be a valid BRL amount.
- Archiving hides the category from new expense forms but keeps historical
  expenses and totals.

## Entity: Expense

Represents a spending entry assigned to one category.

### Fields

- `id`: stable identifier
- `budgetId`: parent monthly budget
- `categoryId`: selected category
- `amount`: decimal string, greater than zero
- `date`: calendar date
- `description`: optional text
- `createdAt`: creation timestamp
- `updatedAt`: last update timestamp

### Relationships

- Belongs to `MonthlyBudget`
- Belongs to `BudgetCategory`

### Validation Rules

- `amount` must be greater than zero.
- `date` must fall within the budget month unless the user explicitly confirms
  a cross-month correction.
- `categoryId` must reference a category from the same budget.

## Entity: CategoryProgress

Derived read model for the category card.

### Fields

- `categoryId`: source category
- `limit`: decimal string
- `spent`: decimal string
- `remaining`: decimal string; may be negative
- `usagePercent`: decimal string
- `state`: `safe`, `warning`, `limitReached`, or `overLimit`

### Calculation Rules

- `spent` is the sum of expenses for the category in the budget month.
- `remaining` equals `limit - spent`.
- `usagePercent` equals `spent / limit * 100`; if limit is zero, use `0` when
  spent is zero and `overLimit` when spent is greater than zero.
- `safe`: usage below 75%.
- `warning`: usage from 75% up to below 100%.
- `limitReached`: usage equals 100%.
- `overLimit`: usage greater than 100%.

## Entity: BalanceSnapshot

Captures the user's monthly financial position.

### Fields

- `id`: stable identifier
- `month`: month key in `YYYY-MM`
- `notes`: optional text
- `createdAt`: creation timestamp
- `updatedAt`: last update timestamp

### Relationships

- Has many `BalanceItem`

### Validation Rules

- Only one primary snapshot may exist for a month.
- Editing a snapshot recalculates totals for that month and all comparisons
  depending on it.

## Entity: BalanceItem

Stores one account, investment, or credit card balance inside a snapshot.

### Fields

- `id`: stable identifier
- `snapshotId`: parent balance snapshot
- `name`: user-facing account/investment/card name
- `kind`: `account`, `investment`, or `creditCard`
- `amount`: decimal string
- `institution`: optional text
- `notes`: optional text
- `sortOrder`: integer for display order

### Relationships

- Belongs to `BalanceSnapshot`

### Validation Rules

- `name` is required.
- Account and investment amounts are treated as assets.
- Credit card amounts are treated as debt. The UI accepts a positive amount for
  the debt balance and converts it into debt totals.
- Amount must be a valid decimal number.

## Entity: FinancialEvolution

Derived read model calculated from snapshots.

### Fields

- `month`: month key
- `assetsTotal`: decimal string
- `debtsTotal`: decimal string
- `netWorth`: decimal string
- `previousNetWorth`: optional decimal string
- `netWorthChange`: decimal string
- `netWorthChangePercent`: optional decimal string

### Calculation Rules

- `assetsTotal` is the sum of account and investment balance items.
- `debtsTotal` is the sum of credit card balance items.
- `netWorth` equals `assetsTotal - debtsTotal`.
- Month-over-month variation compares the current snapshot to the immediately
  previous available snapshot.

## Entity: DataExport

Portable backup format for local data.

### Fields

- `schemaVersion`: export schema version
- `exportedAt`: timestamp
- `profile`: `UserProfile`
- `budgets`: list of `MonthlyBudget`
- `categories`: list of `BudgetCategory`
- `expenses`: list of `Expense`
- `balanceSnapshots`: list of `BalanceSnapshot`
- `balanceItems`: list of `BalanceItem`

### Validation Rules

- Import must validate every section before replacing or merging data.
- Import must report duplicate months, invalid references, and invalid decimal
  values before applying changes.
