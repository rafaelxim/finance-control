# Implementation Plan: Controle Financeiro Gamificado

**Branch**: `N/A - workspace is not a Git repository` | **Date**: 2026-06-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-controle-financeiro-gamificado/spec.md`

## Summary

Build a private-study, local-first finance control web app using Vue. The app
lets one user define a monthly available budget, allocate it across custom
categories as fixed amounts or percentages, track expenses through gamified
Pokémon-themed cards, and record monthly balance snapshots for accounts,
investments, and credit cards. The first implementation is a browser-only SPA
with local persistence, official Pokémon assets stored locally for private
educational use, and export/import support for user-owned data.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.x

**Primary Dependencies**: Vue 3, Vite, Pinia, Vue Router, Dexie, Decimal.js,
Zod, date-fns, Chart.js with vue-chartjs, lucide-vue-next

**Storage**: IndexedDB in the browser through Dexie; JSON export/import for
backup and migration

**Testing**: Vitest, Vue Test Utils, Playwright, vue-tsc, ESLint, Prettier

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Single-page web application

**Performance Goals**: Current-month dashboard visible within 1 second for 5
years of personal-use history; expense/category edits update visible totals
within 100 ms; monthly evolution charts remain interactive for at least 60
monthly snapshots

**Constraints**: Local-only private study app; no backend in initial scope; no
bank, broker, or credit-card integrations; official Pokémon assets are used only
locally and are not published, redistributed, or used commercially

**Scale/Scope**: One local user, 5 years of data, up to 60 monthly budgets, 20
categories per month, 5,000 expenses, 20 financial accounts/investments/cards,
and 60 balance snapshots

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: Use Vue Composition API, TypeScript domain types, Pinia
  stores by bounded area, Zod validation for persisted/imported data, Decimal.js
  for currency math, ESLint/Prettier/vue-tsc for static checks, and small
  feature-scoped components. New dependencies are justified in `research.md`.
- **Testing**: Unit tests cover currency allocation, percentage conversion,
  budget totals, expense totals, balance snapshot totals, month-over-month
  variation, and validation. Component tests cover card states and forms.
  Playwright covers the primary budget, expense, and balance workflows.
- **UX Consistency**: Use a stable app shell with Dashboard, Orçamento,
  Despesas, Balanço, Evolução, and Configurações. Forms share validation,
  loading, empty, and error patterns. Pokémon card states map consistently to
  budget health states.
- **Performance**: IndexedDB queries are scoped by month and indexes. Derived
  totals are computed in stores/selectors and cached per active month where
  useful. Quickstart includes a 5-year seeded history validation.
- **Simplicity**: No backend, authentication, synchronization, or bank
  integrations in the initial scope. IndexedDB was chosen over server storage to
  satisfy the current single-user study requirement with less infrastructure.

Post-design re-check: PASS. `research.md`, `data-model.md`, contracts, and
`quickstart.md` preserve the local-first scope, include validation paths, and
leave no unresolved constitution violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-controle-financeiro-gamificado/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── local-data-contract.md
│   └── ui-flow-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── router/
│   └── styles/
├── assets/
│   └── pokemon/
│       ├── manifest.ts
│       └── README.md
├── components/
│   ├── budget/
│   ├── finance/
│   ├── layout/
│   └── ui/
├── domain/
│   ├── balance/
│   ├── budget/
│   ├── expenses/
│   ├── gamification/
│   └── shared/
├── pages/
├── stores/
├── storage/
└── main.ts

public/
└── pokemon-assets/
    └── official/

tests/
├── e2e/
├── integration/
└── unit/
```

**Structure Decision**: Use a single Vue application at repository root. Domain
logic lives under `src/domain/`, persistence adapters under `src/storage/`, UI
components under `src/components/`, routed pages under `src/pages/`, and
official Pokémon asset files under `public/pokemon-assets/official/` for local
private use.

## Complexity Tracking

No constitution violations identified.
