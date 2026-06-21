# Tasks: Controle Financeiro Gamificado

**Input**: Design documents from `/specs/001-controle-financeiro-gamificado/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required by the Finance Control Constitution. Each behavior-changing
story includes unit, component, integration, or end-to-end tests before
implementation tasks.

**Organization**: Tasks are grouped by user story so each story can be
implemented and tested as an independent increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in the same phase because it
  touches different files and does not depend on incomplete tasks
- **[Story]**: User story label for story phases only
- Every task includes concrete file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Vue application, tooling, project structure, and Binance-style visual reference boundaries.

- [X] T001 Initialize Vue 3 TypeScript Vite project and package scripts in package.json
- [X] T002 Configure Vite application entry and path aliases in vite.config.ts
- [X] T003 Configure TypeScript strict project settings in tsconfig.json
- [X] T004 [P] Configure ESLint for Vue and TypeScript in eslint.config.js
- [X] T005 [P] Configure Prettier formatting rules in .prettierrc.json
- [X] T006 Configure Vitest and Vue Test Utils in vitest.config.ts
- [X] T007 Configure Playwright browser testing in playwright.config.ts
- [X] T008 Create root Vue entry and application bootstrap in src/main.ts
- [X] T009 Create base app component and router outlet in src/App.vue
- [X] T010 Create planned source directory structure with placeholders in src/domain/shared/index.ts
- [X] T011 Create tests directory structure with placeholders in tests/unit/setup.ts
- [X] T012 Adopt DESIGN-binance.md as the app visual reference in DESIGN-binance.md
- [X] T013 Remove character-asset scaffolding from MVP setup in src/components/budget/CategoryBudgetCard.vue

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared domain, persistence, validation, routing, layout, and UI primitives required by every user story.

**Critical**: No user story implementation should begin until this phase is complete.

- [X] T014 Define shared identifiers, month keys, timestamp, and currency types in src/domain/shared/types.ts
- [X] T015 Implement Decimal.js currency helpers for BRL parsing, arithmetic, comparison, and formatting in src/domain/shared/money.ts
- [X] T016 [P] Add unit tests for BRL parsing, arithmetic, rounding, and formatting in tests/unit/domain/shared/money.test.ts
- [X] T017 Implement shared Zod validation helpers for decimal strings, month keys, and required text in src/domain/shared/validation.ts
- [X] T018 [P] Add unit tests for shared validation helpers in tests/unit/domain/shared/validation.test.ts
- [X] T019 Define Dexie database schema, versions, and table typings in src/storage/database.ts
- [X] T020 Implement repository base helpers for timestamps, ids, and transaction wrappers in src/storage/repository.ts
- [X] T021 [P] Add integration tests for IndexedDB schema and required indexes in tests/integration/storage/database.test.ts
- [X] T022 Define UserProfile model and preferences defaults in src/domain/shared/profile.ts
- [X] T023 Implement profile persistence store in src/stores/profile.store.ts
- [X] T024 Configure Vue Router routes for Dashboard, Orçamento, Despesas, Balanço, Evolução, and Configurações in src/app/router/index.ts
- [X] T025 Create AppShell navigation layout with responsive desktop and mobile behavior in src/components/layout/AppShell.vue
- [X] T026 Create shared button, input, select, currency input, month picker, form error, empty state, and loading state components in src/components/ui/index.ts
- [X] T027 [P] Add component tests for shared form validation, empty, and loading states in tests/unit/components/ui/shared-states.test.ts
- [X] T028 Create base application styles and Binance-style dark/yellow tokens in src/app/styles/main.css
- [X] T029 Wire Pinia, router, global styles, and app shell in src/main.ts
- [X] T030 Create Dashboard page stub in src/pages/DashboardPage.vue
- [X] T031 Create route page stubs in src/pages/BudgetPage.vue, src/pages/ExpensesPage.vue, src/pages/BalancePage.vue, src/pages/EvolutionPage.vue, and src/pages/SettingsPage.vue

**Checkpoint**: Foundation ready; user story implementation can start.

---

## Phase 3: User Story 1 - Planejar orçamento mensal por categorias (Priority: P1) MVP

**Goal**: User can create a monthly budget, allocate fixed or percentage category limits, and see gamified category cards with allocation totals.

**Independent Test**: Create a R$ 1.000,00 month with Aluguel R$ 400,00, Comida R$ 300,00, and Lazer R$ 100,00; verify three cards and R$ 200,00 unallocated.

### Tests for User Story 1

- [X] T032 [P] [US1] Add unit tests for fixed and percentage budget allocation calculations in tests/unit/domain/budget/allocation.test.ts
- [X] T033 [P] [US1] Add unit tests for budget and category validation rules in tests/unit/domain/budget/validation.test.ts
- [X] T034 [P] [US1] Add component tests for BudgetSummary totals and over-allocation states in tests/unit/components/budget/BudgetSummary.test.ts
- [X] T035 [P] [US1] Add component tests for CategoryAllocationForm fixed and percentage inputs in tests/unit/components/budget/CategoryAllocationForm.test.ts
- [X] T036 [US1] Add Playwright scenario for monthly budget setup from quickstart scenario 1 in tests/e2e/monthly-budget.spec.ts

### Implementation for User Story 1

- [X] T037 [P] [US1] Define MonthlyBudget, BudgetCategory, and allocation domain types in src/domain/budget/types.ts
- [X] T038 [P] [US1] Implement Zod schemas for monthly budgets and categories in src/domain/budget/schemas.ts
- [X] T039 [US1] Implement budget allocation calculations for fixed, percentage, unallocated, and over-allocated totals in src/domain/budget/allocation.ts
- [X] T040 [US1] Implement budget and category repository functions in src/storage/budget.repository.ts
- [X] T041 [US1] Implement Pinia budget store with active month loading, saving, category CRUD, reordering, and confirmation in src/stores/budget.store.ts
- [X] T042 [P] [US1] Create monthly budget form component in src/components/budget/MonthlyBudgetForm.vue
- [X] T043 [P] [US1] Create category allocation form component in src/components/budget/CategoryAllocationForm.vue
- [X] T044 [P] [US1] Create budget summary totals component in src/components/budget/BudgetSummary.vue
- [X] T045 [P] [US1] Create gamified category card component for allocation preview in src/components/budget/CategoryBudgetCard.vue
- [X] T046 [US1] Implement Orçamento page workflow using budget store and budget components in src/pages/BudgetPage.vue
- [X] T047 [US1] Implement Dashboard current-month budget summary using budget cards in src/pages/DashboardPage.vue
- [X] T048 [US1] Connect route imports for Dashboard and Orçamento pages in src/app/router/index.ts
- [X] T049 [US1] Add empty, loading, validation, and save-success states for budget setup in src/pages/BudgetPage.vue
- [X] T050 [US1] Validate US1 against quickstart scenarios 1 and 2 in specs/001-controle-financeiro-gamificado/quickstart.md

**Checkpoint**: MVP budget planning works independently.

---

## Phase 4: User Story 2 - Acompanhar gastos e progresso gamificado (Priority: P2)

**Goal**: User can register expenses, see category spending progress, and get market-style card states for safe, warning, limit reached, and over-limit categories.

**Independent Test**: Register R$ 75,00 and then R$ 250,00 in Comida with a R$ 300,00 limit; verify remaining values and transition to over-limit.

### Tests for User Story 2

- [ ] T051 [P] [US2] Add unit tests for expense validation and same-budget category references in tests/unit/domain/expenses/validation.test.ts
- [ ] T052 [P] [US2] Add unit tests for category progress state calculations in tests/unit/domain/gamification/category-progress.test.ts
- [ ] T053 [P] [US2] Add component tests for ExpenseForm validation and category creation shortcut in tests/unit/components/expenses/ExpenseForm.test.ts
- [ ] T054 [P] [US2] Add component tests for market-style category card states and accessible text in tests/unit/components/budget/MarketCategoryCard.test.ts
- [ ] T055 [US2] Add Playwright scenario for expense tracking and over-limit card state from quickstart scenario 3 in tests/e2e/expense-progress.spec.ts

### Implementation for User Story 2

- [ ] T056 [P] [US2] Define Expense and CategoryProgress domain types in src/domain/expenses/types.ts
- [ ] T057 [P] [US2] Implement expense Zod schemas and date/category validation in src/domain/expenses/schemas.ts
- [ ] T058 [US2] Implement expense totals and category progress calculations in src/domain/gamification/category-progress.ts
- [ ] T059 [US2] Implement expense repository functions for create, update, delete, and month queries in src/storage/expense.repository.ts
- [ ] T060 [US2] Extend budget store with category progress selectors in src/stores/budget.store.ts
- [ ] T061 [US2] Implement expense Pinia store for month expense loading, mutations, and derived lists in src/stores/expenses.store.ts
- [ ] T062 [P] [US2] Create expense entry form component in src/components/finance/ExpenseForm.vue
- [ ] T063 [P] [US2] Create expense list component with edit and delete actions in src/components/finance/ExpenseList.vue
- [ ] T064 [P] [US2] Create market-style progress card component with text state and currency values in src/components/budget/MarketCategoryCard.vue
- [ ] T065 [US2] Implement Despesas page workflow with expense form, list, and category shortcut in src/pages/ExpensesPage.vue
- [ ] T066 [US2] Replace dashboard allocation preview cards with progress cards after expense data loads in src/pages/DashboardPage.vue
- [ ] T067 [US2] Add Binance-style financial state tokens for category cards in src/app/styles/main.css
- [ ] T068 [US2] Add missing-data and over-limit messaging in src/components/budget/MarketCategoryCard.vue
- [ ] T069 [US2] Validate US2 against quickstart scenario 3 in specs/001-controle-financeiro-gamificado/quickstart.md

**Checkpoint**: Expense tracking and gamified card progress work independently on top of US1.

---

## Phase 5: User Story 3 - Atualizar balanço patrimonial mensal (Priority: P3)

**Goal**: User can create and edit monthly balance snapshots for accounts, investments, and credit cards, then see assets, debts, net worth, and month-over-month changes.

**Independent Test**: Create two monthly snapshots and verify net worth, variation, and breakdown by account, investment, and credit card.

### Tests for User Story 3

- [ ] T070 [P] [US3] Add unit tests for balance item validation and credit card debt treatment in tests/unit/domain/balance/validation.test.ts
- [ ] T071 [P] [US3] Add unit tests for assets, debts, net worth, and monthly variation calculations in tests/unit/domain/balance/evolution.test.ts
- [ ] T072 [P] [US3] Add component tests for BalanceSnapshotForm item add, edit, delete, and totals in tests/unit/components/finance/BalanceSnapshotForm.test.ts
- [ ] T073 [US3] Add Playwright scenario for monthly balance snapshot from quickstart scenario 4 in tests/e2e/balance-snapshot.spec.ts
- [ ] T074 [US3] Add Playwright scenario for financial evolution from quickstart scenario 5 in tests/e2e/financial-evolution.spec.ts

### Implementation for User Story 3

- [ ] T075 [P] [US3] Define BalanceSnapshot, BalanceItem, and FinancialEvolution domain types in src/domain/balance/types.ts
- [ ] T076 [P] [US3] Implement balance snapshot and item Zod schemas in src/domain/balance/schemas.ts
- [ ] T077 [US3] Implement assets, debts, net worth, and month-over-month calculations in src/domain/balance/evolution.ts
- [ ] T078 [US3] Implement balance snapshot and item repository functions in src/storage/balance.repository.ts
- [ ] T079 [US3] Implement balance Pinia store for snapshots, items, totals, and historical evolution in src/stores/balance.store.ts
- [ ] T080 [P] [US3] Create balance snapshot form component in src/components/finance/BalanceSnapshotForm.vue
- [ ] T081 [P] [US3] Create balance item table component in src/components/finance/BalanceItemTable.vue
- [ ] T082 [P] [US3] Create net worth summary component in src/components/finance/NetWorthSummary.vue
- [ ] T083 [P] [US3] Create financial evolution chart component with Chart.js in src/components/finance/FinancialEvolutionChart.vue
- [ ] T084 [US3] Implement Balanço page workflow using balance store and snapshot form in src/pages/BalancePage.vue
- [ ] T085 [US3] Implement Evolução page with period filtering and charts in src/pages/EvolutionPage.vue
- [ ] T086 [US3] Add dashboard net worth summary for current and previous snapshot in src/pages/DashboardPage.vue
- [ ] T087 [US3] Validate US3 against quickstart scenarios 4 and 5 in specs/001-controle-financeiro-gamificado/quickstart.md

**Checkpoint**: Monthly balance and financial evolution work independently with saved data.

---

## Phase 6: User Story 4 - Ajustar categorias e metas ao longo do tempo (Priority: P4)

**Goal**: User can adapt categories, values, percentages, and theme settings while preserving historical month data and supporting export/import backup.

**Independent Test**: Change a current-month category and verify previous months keep their original values; export data, clear local storage, import it, and verify records are restored without decorative media embedded.

### Tests for User Story 4

- [ ] T088 [P] [US4] Add unit tests for historical month preservation when categories are renamed or archived in tests/unit/domain/budget/history-preservation.test.ts
- [ ] T089 [P] [US4] Add unit tests for export/import validation and missing reference errors in tests/unit/domain/shared/data-export.test.ts
- [ ] T090 [P] [US4] Add integration tests for local data export and import round trip in tests/integration/storage/data-export.test.ts
- [ ] T091 [US4] Add Playwright scenario for historical preservation from quickstart scenario 6 in tests/e2e/history-preservation.spec.ts
- [ ] T092 [US4] Add Playwright scenario for export and import from quickstart scenario 8 in tests/e2e/export-import.spec.ts

### Implementation for User Story 4

- [ ] T093 [P] [US4] Define export schema version, export payload types, and visual preference types in src/domain/shared/data-export.ts
- [ ] T094 [US4] Implement historical budget copy and archive rules in src/domain/budget/history.ts
- [ ] T095 [US4] Implement export/import validation with Zod and reference checks in src/domain/shared/data-export.validation.ts
- [ ] T096 [US4] Implement data export/import repository orchestration in src/storage/data-export.repository.ts
- [ ] T097 [US4] Extend budget store with rename, archive, and copy-forward behavior in src/stores/budget.store.ts
- [ ] T098 [US4] Create settings page for visual preferences, export, and import actions in src/pages/SettingsPage.vue
- [ ] T099 [P] [US4] Create export/import panel component with validation results in src/components/finance/DataBackupPanel.vue
- [ ] T100 [P] [US4] Create category visual preference selector component in src/components/budget/CategoryVisualSelector.vue
- [ ] T101 [US4] Wire settings route import and navigation state in src/app/router/index.ts
- [ ] T102 [US4] Validate US4 against quickstart scenarios 6 and 8 in specs/001-controle-financeiro-gamificado/quickstart.md

**Checkpoint**: Historical editing, theme assignment, and local backup workflows work independently.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finish quality, performance, accessibility, documentation, and full quickstart validation across all stories.

- [ ] T103 [P] Seed five-year performance fixture data for budgets, categories, expenses, and snapshots in tests/fixtures/five-year-history.ts
- [ ] T104 Add performance validation test for current-month dashboard and evolution charts in tests/e2e/performance-history.spec.ts
- [ ] T105 Add accessibility checks for navigation, forms, card states, and image alt text in tests/e2e/accessibility.spec.ts
- [ ] T106 [P] Add README setup, asset placement, and private-study usage instructions in README.md
- [ ] T107 [P] Add developer notes for DESIGN-binance.md usage and export boundary in README.md
- [ ] T108 Run lint, formatting, typecheck, unit, integration, and e2e commands and record results in specs/001-controle-financeiro-gamificado/quickstart.md
- [ ] T109 Validate all quickstart scenarios 1 through 8 manually or through Playwright and record evidence in specs/001-controle-financeiro-gamificado/quickstart.md
- [ ] T110 Review UI terminology, loading states, empty states, validation states, and error states for consistency in src/pages/DashboardPage.vue
- [ ] T111 Review local data contract compliance for indexes, decimal strings, and preference export boundary in specs/001-controle-financeiro-gamificado/contracts/local-data-contract.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; start here.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **US1 (Phase 3)**: Depends on Foundational; establishes MVP budget planning.
- **US2 (Phase 4)**: Depends on US1 budget/category data; adds expenses and card progress.
- **US3 (Phase 5)**: Depends on Foundational; can be built after US1 for product flow, but does not require US2 internals.
- **US4 (Phase 6)**: Depends on US1 for historical categories and on Foundational export/import infrastructure; export coverage is strongest after US2 and US3 exist.
- **Polish (Phase 7)**: Depends on selected user stories being complete.

### User Story Dependencies

- **US1**: Independent MVP after foundation.
- **US2**: Requires US1 categories and budget cards.
- **US3**: Independent financial balance workflow after foundation.
- **US4**: Requires US1 for category history; export/import validates all completed data areas.

### Within Each User Story

- Tests are written before implementation tasks for the behavior they cover.
- Domain types and schemas precede calculations and repositories.
- Repositories precede stores.
- Stores precede page workflows.
- Components can be created in parallel when they touch different files.
- Quickstart validation closes each story phase.

---

## Parallel Opportunities

- Setup tasks T004, T005, T006, T007, T010, T011, T012, and T013 can be split after T001.
- Foundational tests and shared components T016, T018, T021, T026, T027, and T028 can proceed in parallel after shared types are stable.
- US1 tests T032 through T036 can be written in parallel before implementation.
- US1 components T042 through T045 can be built in parallel after T037 through T041.
- US2 tests T051 through T055 can be written in parallel before implementation.
- US2 components T062 through T064 can be built in parallel after T056 through T061.
- US3 tests T070 through T074 can be written in parallel before implementation.
- US3 components T080 through T083 can be built in parallel after T075 through T079.
- US4 tests T088 through T092 can be written in parallel before implementation.
- US4 components T099 and T100 can be built in parallel after T093 through T098.

## Parallel Example: User Story 1

```text
Task: "T032 [P] [US1] Add unit tests for fixed and percentage budget allocation calculations in tests/unit/domain/budget/allocation.test.ts"
Task: "T033 [P] [US1] Add unit tests for budget and category validation rules in tests/unit/domain/budget/validation.test.ts"
Task: "T034 [P] [US1] Add component tests for BudgetSummary totals and over-allocation states in tests/unit/components/budget/BudgetSummary.test.ts"
Task: "T035 [P] [US1] Add component tests for CategoryAllocationForm fixed and percentage inputs in tests/unit/components/budget/CategoryAllocationForm.test.ts"
```

## Parallel Example: User Story 2

```text
Task: "T051 [P] [US2] Add unit tests for expense validation and same-budget category references in tests/unit/domain/expenses/validation.test.ts"
Task: "T052 [P] [US2] Add unit tests for category progress state calculations in tests/unit/domain/gamification/category-progress.test.ts"
Task: "T053 [P] [US2] Add component tests for ExpenseForm validation and category creation shortcut in tests/unit/components/expenses/ExpenseForm.test.ts"
Task: "T054 [P] [US2] Add component tests for market-style category card states and accessible text in tests/unit/components/budget/MarketCategoryCard.test.ts"
```

## Parallel Example: User Story 3

```text
Task: "T070 [P] [US3] Add unit tests for balance item validation and credit card debt treatment in tests/unit/domain/balance/validation.test.ts"
Task: "T071 [P] [US3] Add unit tests for assets, debts, net worth, and monthly variation calculations in tests/unit/domain/balance/evolution.test.ts"
Task: "T072 [P] [US3] Add component tests for BalanceSnapshotForm item add, edit, delete, and totals in tests/unit/components/finance/BalanceSnapshotForm.test.ts"
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 only.
3. Validate US1 with quickstart scenarios 1 and 2.
4. Stop for review before adding expenses, balance, or export/import.

### Incremental Delivery

1. US1: Monthly budget, categories, allocation totals, and cards.
2. US2: Expense tracking and market-style card progress states.
3. US3: Balance snapshots and financial evolution.
4. US4: Historical editing, visual preferences, and export/import backup.
5. Polish: performance, accessibility, docs, and full quickstart validation.

### Validation Commands

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test:unit
pnpm test:e2e
```
