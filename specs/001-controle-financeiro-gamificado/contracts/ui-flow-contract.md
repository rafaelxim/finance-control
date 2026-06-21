# UI Flow Contract: Controle Financeiro Gamificado

## Purpose

Defines the user-visible screens, actions, states, and acceptance signals the
Vue application must expose. These contracts drive component and end-to-end
tests.

## Global Navigation

The app shell must expose these destinations:

- `Dashboard`: current month summary, budget health, and quick actions
- `Orçamento`: monthly available amount and category allocation management
- `Despesas`: expense list and expense entry flow
- `Balanço`: monthly balance snapshot entry and editing
- `Evolução`: historical net worth, assets, and debts
- `Configurações`: visual preferences, export/import, and preferences

## Shared UI States

Each screen with persisted data must define:

- Loading state while data is being read or recalculated
- Empty state with the primary next action
- Validation state next to invalid fields and in a form summary
- Success state after save/update/delete
- Error state with retry or recovery action

## Flow: Configure Monthly Budget

### Entry

User opens `Orçamento` for the active month.

### Required Inputs

- Month
- Available amount in BRL
- One or more categories
- Category allocation type: fixed amount or percentage
- Category allocation value

### Actions

- Create monthly budget
- Edit available amount
- Add category
- Edit category
- Reorder category
- Archive category
- Confirm budget

### Output Signals

- Allocated total
- Unallocated total
- Over-allocated total
- Category card preview
- Validation messages for missing, negative, or inconsistent values

### Acceptance Signals

- A budget with R$ 1.000,00 and categories of R$ 400,00, R$ 300,00, and
  R$ 100,00 shows R$ 200,00 unallocated.
- Changing the available amount recalculates percentage categories.
- Over-allocation is visible before confirmation.

## Flow: Track Expenses

### Entry

User opens `Despesas` or uses a dashboard quick action.

### Required Inputs

- Amount in BRL
- Date
- Category
- Optional description

### Actions

- Add expense
- Edit expense
- Delete expense
- Create category when no suitable category exists

### Output Signals

- Expense list grouped or filtered by month
- Updated category card totals
- Remaining amount per category
- Over-limit warning when applicable

### Acceptance Signals

- Adding R$ 75,00 to a category with R$ 300,00 limit shows R$ 225,00 remaining.
- A category crossing its limit changes to `overLimit`.
- Deleting an expense recalculates the card state.

## Flow: Market-Style Category Cards

### Inputs

- Category progress state
- Category label initials or financial glyph

### Visual States

- `safe`: the category is comfortably below limit
- `warning`: the category is nearing the limit
- `limitReached`: the category exactly reached the limit
- `overLimit`: the category exceeded the limit

### Required Accessibility Signals

- Card state must be represented by text in addition to color and imagery.
- Currency values must be readable without relying on the image.

## Flow: Monthly Balance Snapshot

### Entry

User opens `Balanço` for the active month.

### Required Inputs

- Month
- Account items with name and amount
- Investment items with name and amount
- Credit card items with name and debt amount

### Actions

- Create snapshot
- Edit snapshot item
- Delete snapshot item
- Save snapshot
- Correct a past month

### Output Signals

- Assets total
- Debts total
- Net worth
- Difference from previous available snapshot

### Acceptance Signals

- Account and investment values increase assets.
- Credit card values increase debts.
- Net worth equals assets minus debts.
- Editing a past month updates future comparisons that depend on it.

## Flow: Financial Evolution

### Entry

User opens `Evolução`.

### Required Outputs

- Monthly net worth series
- Assets and debts series
- Month-over-month change
- Filter by period

### Acceptance Signals

- With two monthly snapshots, the app shows total variation and variation by
  balance type.
- A 5-year history remains navigable and understandable.

## Flow: Export and Import

### Entry

User opens `Configurações`.

### Actions

- Export finance data to JSON
- Import finance data from JSON
- Validate import before applying

### Acceptance Signals

- Export includes budgets, categories, expenses, snapshots, and balance items.
- Export contains financial data only and does not embed decorative media.
- Import reports invalid references and invalid decimal values before applying.
