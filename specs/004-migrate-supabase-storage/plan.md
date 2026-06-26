# Implementation Plan: Migrar Persistencia Remota

**Branch**: `N/A - workspace did not report a feature branch` | **Date**: 2026-06-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-migrate-supabase-storage/spec.md`

## Summary

Move all finance persistence from browser-local IndexedDB/Dexie repositories to
the configured Supabase project while keeping the application usable without
authentication for this phase. The plan creates a versioned Postgres schema for
the existing finance entities, exposes only the required Data API access for the
publishable client, replaces storage repositories behind the existing Pinia
stores, and provides an idempotent migration path for every record in
`backup.json`.

## Technical Context

**Language/Version**: TypeScript 5.8.x, Vue 3.5.x, Node 22-compatible tooling

**Primary Dependencies**: Vue 3, Vite, Pinia, Vue Router, Decimal.js, Zod,
Supabase JavaScript client v2, Supabase CLI, existing Chart.js/vue-chartjs and
lucide-vue-next UI dependencies

**Storage**: Supabase Postgres via generated Data API for app data; local
IndexedDB/Dexie is removed from primary reads/writes after migration. Remote
project baseline: `public` has no tables; project URL is configured as
`https://fimprjbonudybnxbdaac.supabase.co`; a non-disabled publishable key is
available.

**Testing**: Vitest, Vue Test Utils, Playwright, vue-tsc, ESLint, Prettier,
Supabase advisors, Supabase schema/type checks, and focused migration-count SQL
verification

**Target Platform**: Modern desktop browsers for the Vue single-page
application; mobile must not regress

**Project Type**: Browser-only Vue single-page application backed by Supabase
Postgres/Data API; no custom backend or authentication flow in this phase

**Performance Goals**: Normal dashboard, budget, expense, balance, evolution,
settings, export, and import views become usable within 1 second for the
documented personal-use history; backup migration completes for current
`backup.json` without duplicate records and within an interactive development
run.

**Constraints**: No login, registration, account switching, or user-specific
authorization in this phase; never expose secret/service-role keys in client
code; enable RLS on exposed tables; grant Data API privileges explicitly because
new tables may not be exposed automatically; preserve existing routes,
terminology, validation, loading, empty, error, BRL formatting, and dark
financial visual direction.

**Scale/Scope**: Single shared remote data space, current backup payload of 3
monthly budgets, 16 categories, 7 expenses, 2 balance snapshots, and 6 balance
items; target historical scale remains 5 years of data, up to 60 monthly
budgets, 20 categories per month, 5,000 expenses, 20 financial balance items,
and 60 balance snapshots.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: Reuse existing domain types, Zod validation, Pinia stores,
  and repository boundaries under `src/storage/`. Add a small Supabase client
  module and typed remote repository helpers only where they isolate the storage
  dependency. Keep UI components and domain calculations unchanged unless they
  need error/loading state wiring for remote operations.
- **Testing**: Add repository/integration tests around remote persistence
  mapping, idempotent backup migration, export/import round trip after remote
  migration, and reference validation failures. Update Playwright flows to prove
  data remains after clearing browser-local storage and reloading. Run Supabase
  advisors after schema changes.
- **UX Consistency**: Preserve the current screens and controls for dashboard,
  orcamento, despesas, balanco, evolucao, configuracoes, export, and import.
  Extend current loading and error surfaces for remote failures without adding a
  login or explanatory onboarding flow.
- **Performance**: Keep query scopes aligned with current IndexedDB access
  patterns: month-scoped reads for budgets/expenses, snapshot-scoped reads for
  balance items, ordered category/item queries, and bounded history reads for
  evolution/export. Validate with existing performance-history coverage and
  seeded remote data.
- **Simplicity**: Use Supabase Data API from the existing SPA rather than
  introducing a custom backend or Edge Functions. Keep one shared dataset for
  this unauthenticated phase and document the security tradeoff for future auth.

Post-design re-check: PASS. The design artifacts preserve existing app
boundaries, add only the storage infrastructure required by the feature, define
explicit security gates for public client access, and provide migration and
verification paths for the current backup.

## Project Structure

### Documentation (this feature)

```text
specs/004-migrate-supabase-storage/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── supabase-schema-contract.md
│   ├── remote-repository-contract.md
│   └── backup-migration-contract.md
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
│   ├── balance.store.ts
│   ├── budget.store.ts
│   ├── expenses.store.ts
│   └── profile.store.ts
└── storage/
    ├── balance.repository.ts
    ├── budget.repository.ts
    ├── data-export.repository.ts
    ├── expense.repository.ts
    ├── repository.ts
    └── supabase/          # new remote client, types, mappers, migration helpers

supabase/
├── config.toml            # created by Supabase CLI if absent
├── migrations/
└── seed.sql               # optional local seed derived from backup migration needs

tests/
├── e2e/
├── fixtures/
├── integration/
│   └── storage/
└── unit/
```

**Structure Decision**: Keep the existing single Vue application and store
interfaces. Replace the Dexie-backed internals of storage repositories with
Supabase-backed implementations, add a `src/storage/supabase/` boundary for the
client and mapping code, and introduce a `supabase/` directory only for schema
migrations and optional local seed workflow.

## Complexity Tracking

No constitution violations identified.
