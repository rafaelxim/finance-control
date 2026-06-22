# Dashboard Operational UI Contract

This contract defines user-visible behavior for the desktop operational dashboard
refinement.

## Desktop Layout Contract

- The dashboard must avoid a long stack of equally weighted panels on standard
  desktop viewports.
- The primary summary must be compact and horizontally organized.
- Category tracking must appear high enough that at least part of it is visible
  above the fold when category data exists.
- Supporting patrimony and budget summaries must remain visible and clearly
  associated with the dashboard.
- The desktop main content must not horizontally scroll.

## Primary Summary Contract

The primary summary must expose:

- primary label
- primary amount when available
- cause-oriented state label
- state explanation or context
- comparison amount when it explains the state
- data source label
- contextual action

### Zero Primary Amount

**Given** the primary amount is zero  
**When** the summary renders  
**Then** zero remains visible but must not be the only dominant signal if a
comparison or state explanation better communicates the user's situation.

### Negative Variation

**Given** net worth variation is negative  
**When** the summary renders  
**Then** the state label explains decline or loss context and the negative
variation remains easy to identify.

### Budget Risk

**Given** the monthly budget is over-allocated or category usage is risky  
**When** the summary renders  
**Then** the state label and action communicate budget or spending risk.

## Contextual Action Contract

- The dashboard must show at least one contextual action on desktop.
- Actions must route to existing workflows.
- Spending or category-risk states route toward expenses.
- Budget allocation states route toward budget.
- Patrimony-related states route toward balance.
- Missing data states route toward the setup workflow that makes dashboard data
  available.

## Supporting Section Contract

- Patrimony and budget sections must look related but not interchangeable.
- Patrimony emphasizes net worth and variation.
- Budget emphasizes unallocated amount and excess allocation.
- Section accents must use the established financial color semantics.
- Labels remain familiar and must not remove existing meaning.

## Category Card Contract

Each category card must expose:

- category name
- state label
- remaining amount or deficit
- usage percentage in the primary area
- progress toward limit
- supporting limit amount
- supporting spent amount
- one non-duplicative supporting state or variance signal if a third supporting
  metric is shown

Usage percentage must not be repeated in the supporting metrics after appearing
in the primary area.

## Category Section Title Contract

- If all visible categories are shown, the section title must describe monthly
  tracking, such as "Uso por categoria" or equivalent.
- If only attention categories are shown, the title may describe attention or
  risk.
- Empty states must remain truthful when no categories exist.

## Sidebar Contract

- The active route must have a visual indicator beyond text weight.
- The active icon or item accent must use the product accent color in a
  restrained way.
- Inactive items remain readable and visually quieter than the active item.
- Existing navigation labels and destinations must remain unchanged.
