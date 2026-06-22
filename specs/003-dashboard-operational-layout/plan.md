# Implementation Plan: Dashboard Operational Layout

**Branch**: `N/A - workspace is not a Git repository` | **Date**: 2026-06-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-dashboard-operational-layout/spec.md`

## Summary

Refine the desktop dashboard from a stack of well-labeled panels into a more
operational finance surface. The implementation should make the primary summary
compact and horizontal, introduce contextual state labels and actions,
differentiate patrimony and budget supporting sections, remove repeated usage
metrics from category cards, rename the category section to match its content,
and refine the desktop sidebar active state. This is a presentation refinement
over the existing dashboard components and stores; no new persistence,
backend, or runtime dependency is required.

## Technical Context

**Language/Version**: TypeScript 5.8.x, Vue 3.5.x

**Primary Dependencies**: Vue 3, Vite, Pinia, Vue Router, Decimal.js, Dexie,
date-fns, Chart.js/vue-chartjs, lucide-vue-next

**Storage**: IndexedDB through Dexie; this feature reads existing local budget,
expense, category progress, and balance data and does not add persisted fields

**Testing**: Vitest, Vue Test Utils, Playwright, vue-tsc, ESLint, Prettier

**Target Platform**: Modern desktop browsers; mobile must not regress but the
feature scope is desktop dashboard refinement

**Project Type**: Browser-only Vue single-page application

**Performance Goals**: Dashboard remains visibly ready within 1 second for the
documented personal-use data scale; layout refinements must not add expensive
render-path calculations or extra full-history storage reads

**Constraints**: Local-only private study app; no backend; no authentication; no
external licensed-brand assets; preserve existing navigation destinations,
terminology, loading states, empty states, and dark financial visual direction

**Scale/Scope**: One local user, 5 years of data, up to 60 monthly budgets, 20
categories per month, 5,000 expenses, 20 financial balance items, and 60
balance snapshots

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: Reuse existing `DashboardPage.vue`,
  `DashboardFinancialSummary.vue`, `NetWorthSummary.vue`,
  `BudgetSummary.vue`, `MarketCategoryCard.vue`, `AppShell.vue`, shared CSS
  variables, and existing Pinia-derived data. Any new helper should be scoped to
  dashboard presentation and should avoid duplicating domain calculations.
- **Testing**: Update component tests for contextual summary labels/actions,
  supporting-section emphasis, category-card metric de-duplication, and sidebar
  active state where applicable. Update Playwright coverage for desktop
  first-viewport layout, contextual action routing, category title accuracy, and
  no horizontal overflow.
- **UX Consistency**: Preserve existing routes, terms, sidebar labels, loading
  and empty states, BRL formatting, and non-color state communication. Continue
  the Binance-like financial direction: restrained dark surfaces, yellow
  primary emphasis, green positive states, red negative states, and compact
  operational density.
- **Performance**: Keep all new states derived from already-loaded budget,
  expense, category-progress, and balance-store values. Validate against the
  existing seeded-history performance e2e check.
- **Simplicity**: No new dependency, storage schema, dashboard store, chart, or
  routing flow is needed. Prefer small component/style changes and existing
  RouterLink actions over new infrastructure.

Post-design re-check: PASS. Research and design artifacts keep the feature
presentation-only, preserve data contracts, and define validation without new
infrastructure.

## Project Structure

### Documentation (this feature)

```text
specs/003-dashboard-operational-layout/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── dashboard-operational-ui-contract.md
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
│   │   ├── DashboardFinancialSummary.vue
│   │   └── NetWorthSummary.vue
│   ├── layout/
│   │   └── AppShell.vue
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
│   ├── dashboard-visual-hierarchy.spec.ts
│   ├── expense-progress.spec.ts
│   └── performance-history.spec.ts
└── unit/
    └── components/
        ├── budget/
        ├── dashboard/
        └── finance/
```

**Structure Decision**: Use the existing single Vue application. The feature is
limited to dashboard, shell, summary, and category-card presentation files plus
their tests. Domain or store changes should be avoided unless implementation
discovers a repeated view-state decision that cannot remain readable in the page
or component layer.

## Complexity Tracking

No constitution violations identified.
