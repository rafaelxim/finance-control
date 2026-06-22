# Tasks: Dashboard Operational Layout

**Input**: Design documents from `/specs/003-dashboard-operational-layout/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/dashboard-operational-ui-contract.md, quickstart.md

**Tests**: Required for behavior changes. Component tests cover summary state/action decisions, supporting-section emphasis, category-card metric de-duplication, and sidebar active treatment where applicable. Playwright tests cover desktop layout, above-the-fold visibility, contextual action routing, category title accuracy, and performance.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or depends only on completed earlier tasks
- **[Story]**: User story label from `spec.md`
- Every task includes an exact repository path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm current implementation state and establish the shared desktop layout foundation.

- [X] T001 Verify `.specify/feature.json` points to `specs/003-dashboard-operational-layout` and update it if necessary
- [X] T002 Review the current dashboard layout and summary composition in `src/pages/DashboardPage.vue`
- [X] T003 [P] Review current dashboard summary implementation in `src/components/finance/DashboardFinancialSummary.vue`
- [X] T004 [P] Review current sidebar active-state implementation in `src/components/layout/AppShell.vue`
- [X] T005 [P] Review shared dashboard and monetary styling in `src/app/styles/main.css`
- [X] T006 [P] Review existing dashboard e2e coverage in `tests/e2e/dashboard-visual-hierarchy.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared desktop layout, state, action, and visual primitives used by all user stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T007 Add desktop dashboard layout primitives for primary, main, and supporting areas in `src/app/styles/main.css`
- [X] T008 Add summary state/action view-model fields for cause-oriented labels, descriptions, emphasis, and action target in `src/components/finance/DashboardFinancialSummary.vue`
- [X] T009 Update dashboard summary computed data to include contextual labels, descriptions, emphasis, and action routing in `src/pages/DashboardPage.vue`
- [X] T010 [P] Add shared desktop layout regression helpers or assertions in `tests/e2e/dashboard-visual-hierarchy.spec.ts`
- [X] T011 [P] Add component test scaffolding for new summary action/state cases in `tests/unit/components/dashboard/DashboardFinancialSummary.test.ts`

**Checkpoint**: Shared layout and summary view-state foundation are ready.

---

## Phase 3: User Story 1 - Read the Dashboard Above the Fold (Priority: P1) MVP

**Goal**: Make the desktop dashboard more operational by compacting the primary summary and moving category tracking higher in the first viewport.

**Independent Test**: Opening `/` on a desktop viewport shows a compact horizontal summary and at least part of category tracking above the fold when categories exist.

### Tests for User Story 1

- [X] T012 [P] [US1] Add Playwright assertion that desktop category tracking is visible above the fold in `tests/e2e/dashboard-visual-hierarchy.spec.ts`
- [X] T013 [P] [US1] Add component assertions for compact summary layout classes in `tests/unit/components/dashboard/DashboardFinancialSummary.test.ts`

### Implementation for User Story 1

- [X] T014 [US1] Reorganize `src/pages/DashboardPage.vue` into desktop primary, main category, and supporting summary areas
- [X] T015 [US1] Refactor `src/components/finance/DashboardFinancialSummary.vue` markup into compact horizontal left/right groups
- [X] T016 [US1] Style compact desktop summary and two-column dashboard layout in `src/app/styles/main.css`
- [X] T017 [US1] Verify mobile behavior remains usable without redesign changes in `src/app/styles/main.css`
- [X] T018 [US1] Run focused unit and e2e checks for US1 paths documented in `specs/003-dashboard-operational-layout/quickstart.md`

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Understand Financial State Context (Priority: P2)

**Goal**: Replace generic primary-summary state labels with cause-oriented personal-finance labels and handle zero primary amounts with better hierarchy.

**Independent Test**: Positive, neutral zero, negative variation, and budget-risk states render cause-oriented labels and explanations, with zero values reduced when another signal is more meaningful.

### Tests for User Story 2

- [X] T019 [P] [US2] Add component tests for decline, neutral zero, available capacity, and budget excess labels in `tests/unit/components/dashboard/DashboardFinancialSummary.test.ts`
- [X] T020 [P] [US2] Add Playwright assertion for negative variation state wording on dashboard in `tests/e2e/dashboard-visual-hierarchy.spec.ts`

### Implementation for User Story 2

- [X] T021 [US2] Implement cause-oriented summary state label and description rendering in `src/components/finance/DashboardFinancialSummary.vue`
- [X] T022 [US2] Update dashboard summary selection rules for zero amount, negative variation, budget excess, and available capacity in `src/pages/DashboardPage.vue`
- [X] T023 [US2] Add reduced-emphasis styling for zero primary values in `src/components/finance/DashboardFinancialSummary.vue`
- [X] T024 [US2] Run focused unit and e2e checks for US2 paths documented in `specs/003-dashboard-operational-layout/quickstart.md`

**Checkpoint**: Primary summary state can be understood by cause, not only severity.

---

## Phase 5: User Story 3 - Compare Supporting Sections Efficiently (Priority: P3)

**Goal**: Make patrimony and budget supporting panels visually distinct and emphasize their most decision-relevant metrics.

**Independent Test**: Patrimony emphasizes net worth and variation; budget emphasizes unallocated and excess; both sections remain familiar but no longer look interchangeable.

### Tests for User Story 3

- [X] T025 [P] [US3] Add NetWorthSummary tests for emphasized net worth and variation in `tests/unit/components/finance/NetWorthSummary.test.ts`
- [X] T026 [P] [US3] Add BudgetSummary tests for emphasized unallocated and excess metrics in `tests/unit/components/budget/BudgetSummary.test.ts`
- [X] T027 [P] [US3] Add Playwright assertions for distinct patrimony and budget supporting panels in `tests/e2e/dashboard-visual-hierarchy.spec.ts`

### Implementation for User Story 3

- [X] T028 [US3] Update `src/components/finance/NetWorthSummary.vue` to support patrimony-focused emphasis and accent treatment
- [X] T029 [US3] Update `src/components/budget/BudgetSummary.vue` to support budget-focused emphasis and accent treatment
- [X] T030 [US3] Add supporting panel accent styles and metric hierarchy variants in `src/app/styles/main.css`
- [X] T031 [US3] Integrate supporting panels into the desktop supporting area in `src/pages/DashboardPage.vue`
- [X] T032 [US3] Run focused unit and e2e checks for US3 paths documented in `specs/003-dashboard-operational-layout/quickstart.md`

**Checkpoint**: Supporting finance sections communicate distinct roles.

---

## Phase 6: User Story 4 - Act From the Dashboard (Priority: P4)

**Goal**: Add a contextual dashboard action that routes to the existing workflow most relevant to the visible state.

**Independent Test**: Dashboard shows a contextual action and clicking it routes to expenses, budget, or balance as appropriate.

### Tests for User Story 4

- [X] T033 [P] [US4] Add component tests for summary action labels and targets in `tests/unit/components/dashboard/DashboardFinancialSummary.test.ts`
- [X] T034 [P] [US4] Add Playwright test for contextual dashboard action routing in `tests/e2e/dashboard-visual-hierarchy.spec.ts`

### Implementation for User Story 4

- [X] T035 [US4] Render contextual action as an existing-route link in `src/components/finance/DashboardFinancialSummary.vue`
- [X] T036 [US4] Select contextual action labels and targets from dashboard summary state in `src/pages/DashboardPage.vue`
- [X] T037 [US4] Style contextual dashboard action with existing button/link patterns in `src/components/finance/DashboardFinancialSummary.vue`
- [X] T038 [US4] Run focused unit and e2e checks for US4 paths documented in `specs/003-dashboard-operational-layout/quickstart.md`

**Checkpoint**: Dashboard state includes a useful next action.

---

## Phase 7: User Story 5 - Scan Category Cards Without Repetition (Priority: P5)

**Goal**: Remove duplicated usage percentage from category-card supporting metrics and rename the category section to match all visible cards.

**Independent Test**: Each category card shows usage once in the primary area, supporting metrics add distinct information, and the section title is accurate when safe categories are present.

### Tests for User Story 5

- [X] T039 [P] [US5] Expand MarketCategoryCard tests to assert usage appears once and supporting metrics are non-duplicative in `tests/unit/components/budget/MarketCategoryCard.test.ts`
- [X] T040 [P] [US5] Add Playwright assertion for accurate category section title in `tests/e2e/dashboard-visual-hierarchy.spec.ts`
- [X] T041 [P] [US5] Update expense-progress e2e expectations for category card metrics in `tests/e2e/expense-progress.spec.ts`

### Implementation for User Story 5

- [X] T042 [US5] Remove repeated usage metric from supporting metrics in `src/components/budget/MarketCategoryCard.vue`
- [X] T043 [US5] Replace the third supporting card metric with state or variance information in `src/components/budget/MarketCategoryCard.vue`
- [X] T044 [US5] Rename dashboard category section from attention-only wording to accurate monthly tracking wording in `src/pages/DashboardPage.vue`
- [X] T045 [US5] Refine category-card density after metric de-duplication in `src/components/budget/MarketCategoryCard.vue`
- [X] T046 [US5] Run focused unit and e2e checks for US5 paths documented in `specs/003-dashboard-operational-layout/quickstart.md`

**Checkpoint**: Category cards are denser and section wording is accurate.

---

## Phase 8: User Story 6 - Navigate With a More Refined Shell (Priority: P6)

**Goal**: Improve sidebar active-state identity without changing routes or navigation labels.

**Independent Test**: Active sidebar item has a restrained visual indicator beyond text weight; inactive items remain quiet and readable.

### Tests for User Story 6

- [X] T047 [P] [US6] Add Playwright assertion for active sidebar indicator on dashboard in `tests/e2e/accessibility.spec.ts`
- [X] T048 [P] [US6] Add Playwright assertion that existing sidebar labels and destinations remain unchanged in `tests/e2e/dashboard-visual-hierarchy.spec.ts`

### Implementation for User Story 6

- [X] T049 [US6] Refine active nav item shape, accent bar, and icon color styling in `src/app/styles/main.css`
- [X] T050 [US6] Update `src/components/layout/AppShell.vue` only if needed to expose stable active-state hooks without changing labels or routes
- [X] T051 [US6] Run focused e2e checks for US6 paths documented in `specs/003-dashboard-operational-layout/quickstart.md`

**Checkpoint**: Sidebar active state is polished and restrained.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Validate full feature behavior, performance, and visual consistency.

- [X] T052 [P] Update seeded-history performance expectation coverage in `tests/e2e/performance-history.spec.ts`
- [X] T053 [P] Update accessibility coverage for new dashboard actions and regions in `tests/e2e/accessibility.spec.ts`
- [X] T054 Run `npm run typecheck` and fix type errors in affected `src/` and `tests/` files
- [X] T055 Run `npm run lint` and fix lint issues in affected `src/` and `tests/` files
- [X] T056 Run `npm run format:check` and format affected files if needed
- [X] T057 Run `npm run test:unit` and fix unit/component regressions
- [X] T058 Run `npm run test:e2e` and fix dashboard, expense-progress, accessibility, or performance regressions
- [X] T059 Perform manual desktop review of `/` against `specs/003-dashboard-operational-layout/contracts/dashboard-operational-ui-contract.md`
- [X] T060 Verify mobile layout did not visibly regress from the previous dashboard behavior in `src/app/styles/main.css`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies
- **Phase 2 Foundational**: Depends on Phase 1 and blocks all user stories
- **Phase 3 US1**: Depends on Phase 2; MVP
- **Phase 4 US2**: Depends on Phase 2; can be implemented after or alongside US1
- **Phase 5 US3**: Depends on Phase 2; integrates best after US1 layout exists
- **Phase 6 US4**: Depends on Phase 2; can be implemented after summary view-model exists
- **Phase 7 US5**: Depends on Phase 2; independent from supporting panels
- **Phase 8 US6**: Depends on Phase 2; independent from dashboard content layout
- **Phase 9 Polish**: Depends on all selected user stories

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after foundation
- **US2 (P2)**: No dependency on other stories after foundation
- **US3 (P3)**: No dependency on other stories, but visual integration should be reviewed with US1
- **US4 (P4)**: Depends on the shared summary view-model from foundation
- **US5 (P5)**: No dependency on other stories after foundation
- **US6 (P6)**: No dependency on other stories after foundation

### Parallel Opportunities

- T003, T004, T005, and T006 can run in parallel after T001.
- T010 and T011 can run in parallel during foundation.
- US1 tests T012 and T013 can run in parallel.
- US3 tests T025, T026, and T027 can run in parallel.
- US5 tests T039, T040, and T041 can run in parallel.
- US6 tests T047 and T048 can run in parallel.
- Polish checks T052 and T053 can run in parallel before full validation commands.

---

## Parallel Example: User Story 1

```text
Task: "T012 [P] [US1] Add Playwright assertion that desktop category tracking is visible above the fold in tests/e2e/dashboard-visual-hierarchy.spec.ts"
Task: "T013 [P] [US1] Add component assertions for compact summary layout classes in tests/unit/components/dashboard/DashboardFinancialSummary.test.ts"
```

---

## Parallel Example: User Story 3

```text
Task: "T025 [P] [US3] Add NetWorthSummary tests for emphasized net worth and variation in tests/unit/components/finance/NetWorthSummary.test.ts"
Task: "T026 [P] [US3] Add BudgetSummary tests for emphasized unallocated and excess metrics in tests/unit/components/budget/BudgetSummary.test.ts"
Task: "T027 [P] [US3] Add Playwright assertions for distinct patrimony and budget supporting panels in tests/e2e/dashboard-visual-hierarchy.spec.ts"
```

---

## Parallel Example: User Story 5

```text
Task: "T039 [P] [US5] Expand MarketCategoryCard tests to assert usage appears once and supporting metrics are non-duplicative in tests/unit/components/budget/MarketCategoryCard.test.ts"
Task: "T040 [P] [US5] Add Playwright assertion for accurate category section title in tests/e2e/dashboard-visual-hierarchy.spec.ts"
Task: "T041 [P] [US5] Update expense-progress e2e expectations for category card metrics in tests/e2e/expense-progress.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundation.
3. Complete Phase 3 User Story 1.
4. Stop and validate that desktop `/` shows a compact summary and category tracking above the fold.

### Incremental Delivery

1. Deliver US1 for desktop layout efficiency.
2. Deliver US2 for contextual state language.
3. Deliver US3 for distinct supporting finance panels.
4. Deliver US4 for contextual action.
5. Deliver US5 for denser category cards and accurate section title.
6. Deliver US6 for refined sidebar active state.
7. Complete Phase 9 validation.

### Validation Commands

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test:unit
npm run test:e2e
```
