# Data Model: Dashboard Operational Layout

This feature does not add persisted entities. The models below are view models
and UI states derived from existing dashboard data.

## Operational Dashboard Layout

**Purpose**: Defines how desktop dashboard content is arranged for scannability.

**Fields**:

- `primaryArea`: Contains the compact primary summary and contextual action.
- `mainArea`: Contains category tracking content.
- `supportingArea`: Contains patrimony and budget summaries.
- `viewportMode`: Desktop-oriented layout state; mobile redesign is outside
  this feature.

**Validation Rules**:

- Must not hide the primary financial state.
- Must show at least part of category tracking above the fold on a standard
  desktop viewport when category data exists.
- Must avoid horizontal scrolling on desktop.

## Compact Primary Summary

**Purpose**: Communicates the main financial state and next action.

**Fields**:

- `label`: Primary financial label.
- `primaryAmount`: Main monetary value, if available.
- `primaryAmountEmphasis`: `standard` or `reduced`, based on whether the amount
  itself is meaningful enough to dominate.
- `stateLabel`: Cause-oriented state label.
- `stateDescription`: Short explanation of why the state applies.
- `comparisonLabel`: Optional comparison label.
- `comparisonAmount`: Optional comparison value.
- `sourceLabel`: Existing data source explanation.
- `actionLabel`: Contextual action text.
- `actionTarget`: Existing route target.

**Validation Rules**:

- Zero primary amounts must remain visible but may use reduced emphasis.
- Negative comparison values must be visible when they explain the primary
  state.
- State labels must explain cause rather than only severity.
- Actions must route to an existing workflow.

## Contextual Dashboard Action

**Purpose**: Helps the user respond to visible dashboard state.

**Fields**:

- `label`: Action text.
- `target`: Existing route.
- `reason`: The dashboard state that selected this action.

**Validation Rules**:

- Spending/category-risk states should point to expenses.
- Budget allocation states should point to budget.
- Patrimony freshness or variation states should point to balance.
- Missing setup data should point to the setup workflow most likely to unlock
  useful dashboard information.

## Supporting Finance Section

**Purpose**: Presents patrimony or budget as a supporting, distinct panel.

**Fields**:

- `sectionType`: `patrimony` or `budget`.
- `primaryMetric`: The metric emphasized most strongly in the section.
- `secondaryMetrics`: Supporting metric list.
- `accentState`: Positive, neutral, warning, or negative visual accent.

**Validation Rules**:

- Patrimony emphasizes net worth and variation.
- Budget emphasizes unallocated amount and excess allocation.
- Accent treatments must stay within the existing financial color semantics.

## Category Tracking Section

**Purpose**: Presents visible category cards with accurate section title and
non-duplicated metrics.

**Fields**:

- `title`: Section title that describes all visible cards.
- `cards`: Category risk cards.
- `hasAttentionItems`: Whether any visible card is warning, limit reached, or
  over limit.

**Validation Rules**:

- If all visible cards are shown, title must describe monthly category tracking
  rather than only attention.
- Usage percentage appears once per card in the primary area.
- Supporting card metrics must add distinct information.

## Navigation Active State

**Purpose**: Describes current route treatment in the sidebar.

**Fields**:

- `activeRoute`: Current route.
- `activeAccent`: Visual indicator beyond text weight.
- `iconTreatment`: Active/inactive icon contrast.

**Validation Rules**:

- Active item must be identifiable without relying only on font weight.
- Inactive items must remain quiet and readable.
- Active treatment must not compete with dashboard state colors.
