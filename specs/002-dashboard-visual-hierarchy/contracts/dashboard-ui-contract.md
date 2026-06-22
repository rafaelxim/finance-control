# Dashboard UI Contract

This contract defines user-visible behavior for the dashboard hierarchy feature.
It is intentionally technology-agnostic and can be validated with component,
integration, or end-to-end tests.

## Route Contract

- The canonical dashboard route is `/`.
- If `/dashboard` remains reachable, it must not render an empty main area; it
  must either show the same dashboard content or redirect to `/`.
- The app shell navigation label remains "Dashboard".

## Top Financial Summary Contract

### With Balance Snapshot

**Given** at least one balance snapshot exists  
**When** the user opens the dashboard  
**Then** the first dashboard content area shows:

- a primary net worth amount
- a monthly or latest available variation when available
- a visible positive, neutral, warning, or negative state label/treatment

### Without Balance Snapshot, With Budget Data

**Given** no balance snapshot exists and current-month budget data exists  
**When** the user opens the dashboard  
**Then** the first dashboard content area shows:

- a budget-health primary amount, such as available, unallocated, or excess
  allocation
- a context label explaining the source of the amount
- no fake patrimony amount

### Without Dashboard Data

**Given** no budget categories and no balance snapshot exist  
**When** the user opens the dashboard  
**Then** the dashboard shows an honest empty/setup state and does not present
unknown values as real financial amounts.

## Section Contract

- Patrimony and monthly budget appear as separate named sections.
- Patrimony section distinguishes assets, debts, net worth, and variation.
- Budget section distinguishes available, allocated, unallocated, and excess
  allocation.
- Section order remains understandable on mobile with no horizontal scrolling.

## Category Card Contract

Each category card must expose:

- category name
- state label
- remaining amount or deficit
- usage percentage
- progress toward limit
- supporting limit amount
- supporting spent amount

State labels must include at least:

- `Seguro`
- `Atenção`
- `Limite atingido`
- `Limite excedido`

Risk states must not rely on color alone; text labels, hierarchy, or other
non-color indicators must communicate the state.

## Responsive Contract

- At 360px viewport width, dashboard content must avoid horizontal scrolling in
  the main content.
- Monetary values must not overlap labels, badges, or adjacent values.
- Category cards remain readable when category names or BRL values are long.

## Loading and Empty-State Contract

- Existing loading states remain visible while dashboard stores load.
- Existing empty-state language remains available when no budget categories are
  configured.
- No-data states must be truthful and must not show placeholder financial
  values as if they were user data.
