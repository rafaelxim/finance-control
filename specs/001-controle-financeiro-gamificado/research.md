# Research: Controle Financeiro Gamificado

## Decision: Vue 3 with TypeScript and Vite

**Rationale**: The user explicitly requested Vue. Vue 3 with TypeScript gives a
typed component model, Composition API for reusable feature logic, and a small
learning-friendly setup. Vite keeps local development simple and fast for a
single-page study project.

**Alternatives considered**:

- Vue without TypeScript: simpler at first, but weaker for financial domain
  models and persisted data migrations.
- Nuxt: useful for server rendering and full-stack concerns, but unnecessary
  for a local-only SPA.
- React or Svelte: viable, but conflicts with the explicit Vue request.

## Decision: Local-first SPA with IndexedDB through Dexie

**Rationale**: The initial scope is one private user updating data manually.
IndexedDB supports more data than localStorage, handles structured records, and
works offline. Dexie reduces IndexedDB boilerplate and gives indexed queries by
month, category, and snapshot date.

**Alternatives considered**:

- localStorage: simpler but poor for relational data, larger histories, and
  indexed queries.
- SQLite in a desktop wrapper: strong persistence, but adds packaging and
  runtime complexity before it is needed.
- Backend database: useful for synchronization and multi-device use, but outside
  the first-version scope.

## Decision: Decimal.js for monetary calculations

**Rationale**: Budget allocation, percentages, expense totals, and net worth
must avoid floating-point rounding errors. Decimal.js is small, explicit, and
works well in browser-side TypeScript domain services.

**Alternatives considered**:

- Native number arithmetic: easier but unsafe for currency calculations.
- Integer cents only: reliable and may still be used at persistence boundaries,
  but Decimal.js simplifies percentage allocation and formatting decisions.
- BigInt cents: reliable for storage, but less ergonomic for percentage math and
  chart values.

## Decision: Pinia stores separated by domain

**Rationale**: Budget, expenses, balance snapshots, asset manifest, and UI state
have different lifecycles. Pinia is the standard lightweight Vue store and keeps
derived totals close to the workflows that need them.

**Alternatives considered**:

- Component-only state: becomes hard to share between dashboard, budget, and
  evolution pages.
- Vuex: mature but heavier than needed for a new Vue 3 app.
- A custom event/store layer: unnecessary abstraction for this scale.

## Decision: Zod validation for forms, imports, and persisted data

**Rationale**: The app must reject missing, negative, inconsistent, or malformed
financial values. Zod gives shared validation schemas for UI forms, imported JSON
backups, and data loaded from IndexedDB after future migrations.

**Alternatives considered**:

- Manual validation in each form: duplicates rules and increases drift.
- Browser validation only: insufficient for cross-field rules such as allocation
  totals and snapshot calculations.
- Full form framework: useful later, but not necessary for the initial scope.

## Decision: Official Pokémon assets stored locally for private study

**Rationale**: The user explicitly requested official Pokémon assets and stated
the project will not be public. The implementation will reference local files
under `public/pokemon-assets/official/` and a manifest in `src/assets/pokemon/`
so the UI is deterministic and does not require runtime scraping or third-party
asset availability.

**Alternatives considered**:

- Use generated or original monster art: legally cleaner for public release, but
  does not match the user's study requirement.
- Hotlink official public URLs: brittle, slower, and dependent on external
  network access.
- PokeAPI sprites only: convenient but not the same as explicitly managing
  official study assets and can blur source/usage expectations.

## Decision: Chart.js with vue-chartjs for financial evolution

**Rationale**: The app needs simple line and bar charts for net worth, assets,
debts, and month-over-month variation. Chart.js is enough for this scope and
vue-chartjs keeps integration idiomatic without introducing a heavy dashboard
framework.

**Alternatives considered**:

- Raw SVG charts: lower dependency count, but more implementation work for
  axes, tooltips, responsiveness, and accessibility.
- Apache ECharts: powerful, but heavier than the current charting needs.
- No chart library: weakens the financial evolution workflow.

## Decision: Vitest, Vue Test Utils, and Playwright

**Rationale**: Vitest fits Vite projects and covers domain logic quickly. Vue
Test Utils validates component behavior and card states. Playwright covers the
critical user journeys: budget setup, expense tracking, and monthly balance
snapshot.

**Alternatives considered**:

- Jest: viable but more setup friction in Vite projects.
- Cypress: viable for browser testing, but Playwright has strong multi-browser
  support and straightforward trace/debug artifacts.
- Manual testing only: violates the constitution and is too risky for financial
  calculations.

## Decision: JSON export/import as the first backup path

**Rationale**: A local-only app needs a user-controlled way to back up and move
data. JSON export/import is transparent, easy to validate with Zod, and avoids
introducing accounts or cloud sync.

**Alternatives considered**:

- No backup: risky because browser data can be cleared.
- Cloud sync: useful later, but adds authentication, privacy, and backend
  complexity.
- CSV only: good for expenses, but poor for preserving full relationships and
  gamification metadata.
