# Tasks: Dashboard Visual Hierarchy

**Input**: Design documents from `/specs/002-dashboard-visual-hierarchy/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/dashboard-ui-contract.md, quickstart.md

**Tests**: Required by the Finance Control Constitution for behavior changes. Component tests cover view-model selection, labels, monetary values, and state text. Playwright tests cover dashboard ordering, route behavior, mobile fit, and category-risk flows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or depends only on completed earlier tasks
- **[Story]**: User story label from `spec.md`
- Every task includes an exact repository path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the active feature context and inspect current dashboard behavior before changing code.

- [ ] T001 Verify `.specify/feature.json` points to `specs/002-dashboard-visual-hierarchy` and update it if necessary
- [ ] T002 Review current dashboard route behavior in `src/app/router/index.ts` and current dashboard composition in `src/pages/DashboardPage.vue`
- [ ] T003 [P] Review existing dashboard summary styling tokens in `src/app/styles/main.css`
- [ ] T004 [P] Review existing component tests for summary and category cards under `tests/unit/components/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared dashboard presentation primitives used by all user stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T005 Add shared dashboard value/state CSS utilities and tighten card radius tokens in `src/app/styles/main.css`
- [ ] T006 Add dashboard route handling so `/dashboard` cannot render an empty main area in `src/app/router/index.ts`
- [ ] T007 [P] Add a focused route regression test for `/dashboard` behavior in `tests/e2e/dashboard-visual-hierarchy.spec.ts`
- [ ] T008 Define dashboard financial state helper types or local view-model interfaces in `src/pages/DashboardPage.vue`

**Checkpoint**: Shared dashboard route and styling foundation are ready.

---

## Phase 3: User Story 1 - Understand the Month at a Glance (Priority: P1) MVP

**Goal**: Show a compact top financial summary before detailed dashboard sections, backed by balance data when available and budget data as fallback.

**Independent Test**: Opening `/` shows one primary financial amount, context/comparison, and a clear state before detailed cards; missing balance data does not produce fake patrimony values.

### Tests for User Story 1

- [ ] T009 [P] [US1] Add component tests for balance-backed and budget-backed top summary selection in `tests/unit/components/dashboard/DashboardFinancialSummary.test.ts`
- [ ] T010 [P] [US1] Add Playwright coverage for top summary visibility before detailed sections in `tests/e2e/dashboard-visual-hierarchy.spec.ts`

### Implementation for User Story 1

- [ ] T011 [US1] Create `src/components/finance/DashboardFinancialSummary.vue` to render primary amount, comparison/context, source label, and state text
- [ ] T012 [US1] Add computed dashboard financial summary selection in `src/pages/DashboardPage.vue` using existing balance, budget, and expense store data
- [ ] T013 [US1] Place `DashboardFinancialSummary` before patrimony, budget, and category sections in `src/pages/DashboardPage.vue`
- [ ] T014 [US1] Style top summary states and monetary hierarchy in `src/components/finance/DashboardFinancialSummary.vue`
- [ ] T015 [US1] Run focused unit and e2e checks for US1 paths documented in `specs/002-dashboard-visual-hierarchy/quickstart.md`

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Compare Net Worth and Budget Sections (Priority: P2)

**Goal**: Make patrimony and monthly budget summaries visually distinct, clearly labeled, and semantically colored.

**Independent Test**: Opening `/` with assets, debts, and budget totals shows separate named sections for patrimony and monthly budget with distinguishable metric roles and financial states.

### Tests for User Story 2

- [ ] T016 [P] [US2] Update or add BudgetSummary component tests for available, allocated, unallocated, and excess state labels in `tests/unit/components/budget/BudgetSummary.test.ts`
- [ ] T017 [P] [US2] Add NetWorthSummary component tests for assets, debts, net worth, positive variation, negative variation, and neutral variation in `tests/unit/components/finance/NetWorthSummary.test.ts`
- [ ] T018 [P] [US2] Add Playwright assertions for separate patrimony and budget section labels in `tests/e2e/dashboard-visual-hierarchy.spec.ts`

### Implementation for User Story 2

- [ ] T019 [US2] Update `src/components/finance/NetWorthSummary.vue` to include visible section heading, metric roles, and non-color state indicators
- [ ] T020 [US2] Update `src/components/budget/BudgetSummary.vue` to include visible section heading, metric roles, and excess/unallocated state treatments
- [ ] T021 [US2] Update dashboard section ordering and spacing around summary sections in `src/pages/DashboardPage.vue`
- [ ] T022 [US2] Refine summary panel density and responsive grid behavior in `src/app/styles/main.css`
- [ ] T023 [US2] Run focused unit and e2e checks for US2 paths documented in `specs/002-dashboard-visual-hierarchy/quickstart.md`

**Checkpoint**: User Stories 1 and 2 work independently and together.

---

## Phase 5: User Story 3 - Scan Category Risk Quickly (Priority: P3)

**Goal**: Rework category cards so remaining amount, usage percentage, progress, and risk state are immediately visible while limit and spent remain supporting metrics.

**Independent Test**: Category cards in safe, warning, limit reached, and over-limit states expose state label, remaining/deficit amount, usage percentage, progress, limit, and spent values without relying on color alone.

### Tests for User Story 3

- [ ] T024 [P] [US3] Expand MarketCategoryCard tests for usage percentage, remaining-first hierarchy, and safe/warning/limit/over-limit labels in `tests/unit/components/budget/MarketCategoryCard.test.ts`
- [ ] T025 [P] [US3] Add Playwright assertions for warning and over-limit categories being identifiable without manual subtraction in `tests/e2e/expense-progress.spec.ts`
- [ ] T026 [P] [US3] Add mobile category-card fit assertions in `tests/e2e/dashboard-visual-hierarchy.spec.ts`

### Implementation for User Story 3

- [ ] T027 [US3] Reorder `src/components/budget/MarketCategoryCard.vue` markup to prioritize remaining amount, usage percentage, and state before supporting metrics
- [ ] T028 [US3] Update `src/components/budget/MarketCategoryCard.vue` copy for no-limit spending, exact-limit, warning, safe, and over-limit states
- [ ] T029 [US3] Refine `src/components/budget/MarketCategoryCard.vue` styles for denser layout, state badges, progress track, and mobile text fit
- [ ] T030 [US3] Ensure `src/domain/gamification/category-progress.ts` exposes enough state data for no-limit, exact-limit, and over-limit card states without adding persistence
- [ ] T031 [US3] Run focused unit and e2e checks for US3 paths documented in `specs/002-dashboard-visual-hierarchy/quickstart.md`

**Checkpoint**: Category risk can be scanned directly from dashboard cards.

---

## Phase 6: User Story 4 - Read Financial Values Comfortably (Priority: P4)

**Goal**: Normalize monetary typography and responsive value behavior across the dashboard.

**Independent Test**: Desktop and 360px mobile dashboard views show primary, secondary, and supporting monetary values with consistent hierarchy, numeric alignment, and no overlap.

### Tests for User Story 4

- [ ] T032 [P] [US4] Add component assertions for long BRL values in `tests/unit/components/dashboard/DashboardFinancialSummary.test.ts`
- [ ] T033 [P] [US4] Add responsive no-overlap assertions for dashboard monetary values in `tests/e2e/dashboard-visual-hierarchy.spec.ts`

### Implementation for User Story 4

- [ ] T034 [US4] Add shared monetary typography utility classes in `src/app/styles/main.css`
- [ ] T035 [US4] Apply shared monetary typography classes in `src/components/finance/DashboardFinancialSummary.vue`
- [ ] T036 [US4] Apply shared monetary typography classes in `src/components/finance/NetWorthSummary.vue`
- [ ] T037 [US4] Apply shared monetary typography classes in `src/components/budget/BudgetSummary.vue`
- [ ] T038 [US4] Apply shared monetary typography classes in `src/components/budget/MarketCategoryCard.vue`
- [ ] T039 [US4] Run focused mobile and desktop visual validation from `specs/002-dashboard-visual-hierarchy/quickstart.md`

**Checkpoint**: Dashboard values are consistently readable across viewport sizes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full feature, clean up implementation, and ensure no regressions in related flows.

- [ ] T040 [P] Update accessibility checks for dashboard headings, regions, and state labels in `tests/e2e/accessibility.spec.ts`
- [ ] T041 [P] Verify seeded-history dashboard performance remains within expectation using `tests/e2e/performance-history.spec.ts`
- [ ] T042 Run `npm run typecheck` and fix any type errors in affected `src/` and `tests/` files
- [ ] T043 Run `npm run lint` and fix lint issues in affected `src/` and `tests/` files
- [ ] T044 Run `npm run format:check` and format affected files if needed
- [ ] T045 Run `npm run test:unit` and fix unit/component regressions
- [ ] T046 Run `npm run test:e2e` and fix dashboard, expense-progress, accessibility, or performance regressions
- [ ] T047 Perform manual desktop review of `/` against `specs/002-dashboard-visual-hierarchy/contracts/dashboard-ui-contract.md`
- [ ] T048 Perform manual 360px mobile review of `/` against `specs/002-dashboard-visual-hierarchy/contracts/dashboard-ui-contract.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies
- **Phase 2 Foundational**: Depends on Phase 1; blocks all user stories
- **Phase 3 US1**: Depends on Phase 2; MVP
- **Phase 4 US2**: Depends on Phase 2; can be implemented after or alongside US1 but should be verified with US1 present
- **Phase 5 US3**: Depends on Phase 2; can be implemented independently of US2
- **Phase 6 US4**: Depends on Phase 2; benefits from US1-US3 markup but can start once affected components exist
- **Phase 7 Polish**: Depends on all selected user stories

### User Story Dependencies

- **US1 (P1)**: No dependency on other user stories
- **US2 (P2)**: No strict dependency on US1, but integrates visually with the top summary
- **US3 (P3)**: No dependency on US1 or US2
- **US4 (P4)**: Cross-cuts US1-US3 components; best completed after the target markup exists

### Parallel Opportunities

- T003 and T004 can run in parallel with T002 after T001.
- T007 can run in parallel with T005/T006 after route expectations are clear.
- US1 tests T009 and T010 can run in parallel before implementation.
- US2 tests T016, T017, and T018 can run in parallel.
- US3 tests T024, T025, and T026 can run in parallel.
- US4 tests T032 and T033 can run in parallel.
- Polish checks T040 and T041 can run in parallel before full validation commands.

---

## Parallel Example: User Story 1

```text
Task: "T009 [P] [US1] Add component tests for balance-backed and budget-backed top summary selection in tests/unit/components/dashboard/DashboardFinancialSummary.test.ts"
Task: "T010 [P] [US1] Add Playwright coverage for top summary visibility before detailed sections in tests/e2e/dashboard-visual-hierarchy.spec.ts"
```

---

## Parallel Example: User Story 2

```text
Task: "T016 [P] [US2] Update or add BudgetSummary component tests for available, allocated, unallocated, and excess state labels in tests/unit/components/budget/BudgetSummary.test.ts"
Task: "T017 [P] [US2] Add NetWorthSummary component tests for assets, debts, net worth, positive variation, negative variation, and neutral variation in tests/unit/components/finance/NetWorthSummary.test.ts"
Task: "T018 [P] [US2] Add Playwright assertions for separate patrimony and budget section labels in tests/e2e/dashboard-visual-hierarchy.spec.ts"
```

---

## Parallel Example: User Story 3

```text
Task: "T024 [P] [US3] Expand MarketCategoryCard tests for usage percentage, remaining-first hierarchy, and safe/warning/limit/over-limit labels in tests/unit/components/budget/MarketCategoryCard.test.ts"
Task: "T025 [P] [US3] Add Playwright assertions for warning and over-limit categories being identifiable without manual subtraction in tests/e2e/expense-progress.spec.ts"
Task: "T026 [P] [US3] Add mobile category-card fit assertions in tests/e2e/dashboard-visual-hierarchy.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundation.
3. Complete Phase 3 User Story 1.
4. Stop and validate that `/` shows the compact top financial summary correctly for balance-backed and budget-backed states.

### Incremental Delivery

1. Deliver US1 for immediate dashboard orientation.
2. Deliver US2 to separate patrimony and budget summaries.
3. Deliver US3 to improve operational category risk scanning.
4. Deliver US4 to normalize monetary typography and responsive fit.
5. Complete Phase 7 full validation.

### Validation Commands

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test:unit
npm run test:e2e
```
