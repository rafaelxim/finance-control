# Quickstart: Dashboard Operational Layout

## Prerequisites

- Dependencies installed with `npm install`.
- Browser dependencies installed for Playwright if running e2e tests.
- Current feature selected in `.specify/feature.json`.

## Static Validation

Run:

```bash
npm run typecheck
npm run lint
npm run format:check
```

Expected outcome: all commands pass.

## Unit and Component Validation

Run:

```bash
npm run test:unit
```

Expected outcomes:

- Primary summary renders cause-oriented labels for decline, neutral zero,
  budget excess, and available-capacity states.
- Primary summary renders a contextual action with an existing route target.
- Supporting patrimony and budget sections expose distinct emphasized metrics.
- Category cards show usage percentage once and keep required limit/spent/state
  information.

## End-to-End Validation

Run:

```bash
npm run test:e2e
```

Expected outcomes:

- Desktop dashboard shows a compact primary summary.
- On a standard desktop viewport, at least part of category tracking appears
  above the fold when dashboard data exists.
- Contextual action is visible and routes to an existing workflow.
- Category section title accurately describes the visible cards.
- Sidebar active state is identifiable beyond text weight.
- Seeded-history performance remains within the documented 1-second dashboard
  expectation.

## Manual Desktop Review

Start the app:

```bash
npm run dev
```

Review at a standard desktop viewport:

1. Open `/`.
2. Confirm the primary summary reads as a compact row rather than a tall hero.
3. Confirm zero primary values do not dominate over meaningful negative or
   warning context.
4. Confirm the primary state label explains the cause of the state.
5. Confirm the contextual action is visible and points to the appropriate
   workflow.
6. Confirm patrimony and budget panels are visually distinct.
7. Confirm category cards do not repeat usage percentage.
8. Confirm the category section title matches the content shown.
9. Confirm the sidebar active state is clear without relying only on bold text.

## Contract

Validate behavior against
[dashboard-operational-ui-contract.md](./contracts/dashboard-operational-ui-contract.md).
