# Quickstart: Controle Financeiro Gamificado

## Purpose

Validate the implemented Vue application end-to-end against the feature spec,
data model, and UI/data contracts.

## Prerequisites

- Node.js LTS installed
- pnpm installed
- Official Pokémon assets available locally under
  `public/pokemon-assets/official/`
- Asset manifest configured in `src/assets/pokemon/manifest.ts`

## Setup

```bash
pnpm install
pnpm dev
```

Open the local development URL printed by the dev server.

## Quality Commands

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test:unit
pnpm test:e2e
```

All commands must pass before the feature is considered complete. If a command
is intentionally unavailable during an early implementation slice, the task list
must document the gap and the replacement validation.

## Scenario 1: Configure Monthly Budget

1. Open `Orçamento`.
2. Select the current month.
3. Set available amount to `R$ 1.000,00`.
4. Add categories:
   - `Aluguel`: fixed `R$ 400,00`
   - `Comida`: fixed `R$ 300,00`
   - `Lazer`: fixed `R$ 100,00`
5. Confirm the budget.

Expected results:

- Three category cards are visible.
- Allocated total is `R$ 800,00`.
- Unallocated total is `R$ 200,00`.
- No over-allocation warning appears.

## Scenario 2: Percentage Allocation Recalculation

1. Open the current budget.
2. Add category `Investir` with allocation type `percentage` and value `10%`.
3. Change the available monthly amount from `R$ 1.000,00` to `R$ 1.500,00`.

Expected results:

- `Investir` recalculates from `R$ 100,00` to `R$ 150,00`.
- Fixed categories keep their fixed values.
- Allocated, unallocated, and over-allocated totals update immediately.

## Scenario 3: Track Expense and Card State

1. Open `Despesas`.
2. Register an expense of `R$ 75,00` in `Comida`.
3. Return to `Dashboard`.

Expected results:

- `Comida` shows `R$ 75,00` spent.
- `Comida` shows `R$ 225,00` remaining.
- The card remains in the `safe` state.

Then:

1. Register another `Comida` expense of `R$ 250,00`.

Expected results:

- `Comida` shows `R$ 325,00` spent.
- `Comida` shows `-R$ 25,00` remaining.
- The card state changes to `overLimit` with text and visual treatment.

## Scenario 4: Monthly Balance Snapshot

1. Open `Balanço`.
2. Create a snapshot for the current month with:
   - Conta Corrente: `R$ 2.000,00`
   - Investimentos: `R$ 5.000,00`
   - Cartão de Crédito: `R$ 1.200,00`
3. Save the snapshot.

Expected results:

- Assets total is `R$ 7.000,00`.
- Debts total is `R$ 1.200,00`.
- Net worth is `R$ 5.800,00`.

## Scenario 5: Financial Evolution

1. Create a previous-month snapshot with net worth of `R$ 5.000,00`.
2. Keep the current-month snapshot from Scenario 4.
3. Open `Evolução`.

Expected results:

- The app shows both months in chronological order.
- Net worth variation is `R$ 800,00`.
- Assets, debts, and net worth are visually distinguishable.

## Scenario 6: Historical Preservation

1. Close or leave a previous month with categories and expenses.
2. Open the current month.
3. Rename a category or change its allocation.
4. Reopen the previous month.

Expected results:

- Previous-month values remain consultable.
- Historical totals do not silently change.
- Current-month changes are visible only where expected.

## Scenario 7: Five-Year History Performance

1. Seed or create 60 monthly budgets.
2. Include at least 20 categories, 5,000 expenses, and 60 balance snapshots.
3. Open `Dashboard`, `Orçamento`, and `Evolução`.

Expected results:

- Current-month dashboard appears within 1 second.
- Expense/category edits update visible totals within 100 ms.
- Evolution charts remain interactive and readable.

## Scenario 8: Export and Import

1. Open `Configurações`.
2. Export local finance data.
3. Clear local app data in the browser.
4. Import the exported file.

Expected results:

- Budgets, categories, expenses, snapshots, and balance items are restored.
- Pokémon asset assignments are restored when matching local assets exist.
- Export file does not include official Pokémon binary asset data.

## Reference Contracts

- [Data model](./data-model.md)
- [Local data contract](./contracts/local-data-contract.md)
- [UI flow contract](./contracts/ui-flow-contract.md)
