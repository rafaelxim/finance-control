# Implementation Plan: Dashboard Visual Hierarchy

**Branch**: `N/A - workspace is not a Git repository` | **Date**: 2026-06-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-dashboard-visual-hierarchy/spec.md`

## Summary

Refine the current dashboard into a clearer financial decision surface by adding
a compact top financial summary, separating patrimony and monthly budget
sections, tightening card density and rounding, improving monetary typography,
and making category risk cards emphasize remaining amount, usage percentage,
progress, and risk state. The implementation should reuse the existing Vue
single-page application, Pinia stores, domain calculations, shared styling
tokens, and dashboard components, with no new runtime dependencies.

## Technical Context

**Language/Version**: TypeScript 5.8.x, Vue 3.5.x

**Primary Dependencies**: Vue 3, Vite, Pinia, Vue Router, Decimal.js, Dexie,
date-fns, Chart.js/vue-chartjs, lucide-vue-next

**Storage**: IndexedDB through Dexie; this feature reads existing local budget,
expense, and balance data and does not introduce new persisted fields

**Testing**: Vitest, Vue Test Utils, Playwright, vue-tsc, ESLint, Prettier

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Browser-only Vue single-page application

**Performance Goals**: Dashboard visible within 1 second for the documented
personal-use data scale; derived visual states update with the current store
data without adding new storage queries or expensive render-path work

**Constraints**: Local-only private study app; no backend; no authentication;
no external licensed-brand assets; preserve the established dark financial
visual direction and Brazilian Real formatting

**Scale/Scope**: One local user, 5 years of data, up to 60 monthly budgets, 20
categories per month, 5,000 expenses, 20 financial balance items, and 60
balance snapshots

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: Follow existing Vue Composition API and single-file
  component patterns. Reuse `DashboardPage.vue`, summary/card components,
  Pinia selectors, `formatBRL`, and existing CSS variables before adding new
  abstractions. If a new summary component is introduced, keep it scoped to the
  dashboard and driven by existing store-derived values.
- **Testing**: Add or update unit/component tests for dashboard summary
  selection, summary/card visual states, category card hierarchy, and monetary
  text rendering. Add or update Playwright coverage for the dashboard's primary
  at-a-glance state, warning/over-limit category detection, empty/no-balance
  cases where feasible, and mobile layout checks.
- **UX Consistency**: Preserve the app shell, route names, financial terms,
  loading state, empty state, and current category state labels. Extend the
  existing Binance-like dark visual direction: yellow for primary emphasis,
  green for positive/remaining states, red for negative/exceeded states, and a
  non-color signal for state labels.
- **Performance**: Keep the dashboard based on already-loaded budget, expense,
  and balance store data. Avoid introducing additional full-history work during
  render. Validate with existing performance/e2e flows and manual desktop/mobile
  checks against the seeded data scale.
- **Simplicity**: No new dependency, backend, persistence schema, chart, or
  design-system rewrite is needed. Prefer small scoped component/style changes
  over a broad refactor.

Post-design re-check: PASS. Research and design artifacts keep the feature as a
presentation-only dashboard refinement, preserve existing data contracts, and
define validation without adding unnecessary infrastructure.

## Project Structure

### Documentation (this feature)

```text
specs/002-dashboard-visual-hierarchy/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── dashboard-ui-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── router/
│   └── styles/
├── components/
│   ├── budget/
│   │   ├── BudgetSummary.vue
│   │   └── MarketCategoryCard.vue
│   ├── finance/
│   │   └── NetWorthSummary.vue
│   └── ui/
├── pages/
│   └── DashboardPage.vue
├── stores/
│   ├── balance.store.ts
│   ├── budget.store.ts
│   └── expenses.store.ts
└── domain/
    ├── gamification/
    └── shared/

tests/
├── e2e/
│   ├── accessibility.spec.ts
│   ├── expense-progress.spec.ts
│   └── performance-history.spec.ts
└── unit/
    ├── components/
    │   ├── budget/
    │   └── finance/
    └── domain/
```

**Structure Decision**: Use the existing single Vue application layout. The
feature primarily touches `DashboardPage.vue`, `BudgetSummary.vue`,
`NetWorthSummary.vue`, `MarketCategoryCard.vue`, shared CSS tokens in
`src/app/styles/main.css`, and related tests. Domain and store changes should be
limited to small derived helpers only if presentation cannot cleanly compute the
needed state from existing values.

## Complexity Tracking

No constitution violations identified.
