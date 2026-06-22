# Quickstart: Dashboard Visual Hierarchy

## Prerequisites

- Dependencies installed with `npm install`.
- Browser dependencies installed for Playwright if running e2e tests.
- Current feature selected in `.specify/feature.json`.

## Static Validation

Run the baseline quality checks:

```bash
npm run typecheck
npm run lint
npm run format:check
```

Expected outcome: all commands pass without type, lint, or formatting errors.

## Unit and Component Validation

Run focused unit/component tests:

```bash
npm run test:unit
```

Expected outcomes:

- Summary components render financial labels and BRL values correctly.
- Dashboard top-summary selection covers balance-backed and budget-backed
  states.
- Category cards expose remaining amount, usage percentage, supporting metrics,
  progress, and accessible state labels.
- Safe, warning, limit-reached, and over-limit states remain testable without
  relying only on color.

## End-to-End Validation

Run the dashboard-related Playwright suite:

```bash
npm run test:e2e
```

Expected outcomes:

- Opening `/` shows the compact top financial summary before detailed sections.
- Patrimony and budget summaries are separate and clearly labeled.
- Adding expenses updates category cards so warning and over-limit states are
  identifiable without manual calculation.
- Empty or missing-data scenarios do not show misleading financial values.
- The dashboard remains usable on mobile-width viewports without horizontal
  scrolling or text overlap.

## Manual Visual Review

Start the app:

```bash
npm run dev
```

Review:

1. Open `/` at a desktop viewport.
2. Confirm the first dashboard content area communicates the primary financial
   state within 5 seconds.
3. Confirm patrimony and budget sections are visually distinct.
4. Confirm category cards prioritize remaining amount, usage percentage, and
   risk state.
5. Resize to a 360px-wide viewport.
6. Confirm monetary values, badges, and labels remain readable and do not
   overlap.

## Contracts

Validate implementation behavior against
[dashboard-ui-contract.md](./contracts/dashboard-ui-contract.md).
