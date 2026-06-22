# Data Model: Dashboard Visual Hierarchy

This feature does not add persisted entities. The models below are view models
derived from existing budget, expense, category progress, and balance data.

## Dashboard Financial Summary

**Purpose**: Provides the first at-a-glance financial signal on the dashboard.

**Fields**:

- `label`: Human-readable name of the primary amount, such as "Patrimônio
  líquido" or "Saldo disponivel do mês".
- `primaryAmount`: Monetary amount shown as the main value.
- `comparisonLabel`: Optional human-readable context, such as monthly variation
  or remaining allocation context.
- `comparisonAmount`: Optional monetary comparison amount.
- `state`: One of `positive`, `neutral`, `warning`, or `negative`.
- `source`: One of `balance`, `budget`, or `none`, indicating which existing
  data made the summary possible.

**Validation Rules**:

- Must not show a balance-derived primary amount when no balance snapshot exists.
- Must not show unknown values as `R$ 0,00`.
- `state` must match financial meaning: positive for favorable changes or
  remaining capacity, negative for losses or excess allocation, warning for
  limited/risky capacity, and neutral for zero or unavailable comparisons.

## Patrimony Summary

**Purpose**: Groups long-term financial position metrics separately from monthly
budget metrics.

**Fields**:

- `assetsTotal`: Existing assets total.
- `debtsTotal`: Existing debts total.
- `netWorth`: Existing net worth total.
- `netWorthChange`: Optional recent variation.
- `hasSnapshot`: Whether the summary is backed by a real balance snapshot.

**Validation Rules**:

- Must only render patrimony metrics when backed by existing balance data or a
  clearly labeled no-data state.
- Debts and negative variation must have negative/risk treatment.
- Assets and positive variation must have positive treatment.
- Zero variation must be neutral.

## Budget Summary

**Purpose**: Groups current-month allocation metrics separately from patrimony.

**Fields**:

- `availableAmount`: Current monthly amount available for allocation.
- `allocated`: Amount allocated across categories.
- `unallocated`: Amount not yet allocated.
- `overAllocated`: Amount allocated beyond availability.

**Validation Rules**:

- `overAllocated` greater than zero is a negative/risk state.
- `unallocated` greater than zero is a positive or neutral available-capacity
  state depending on presentation context.
- Zero values remain neutral unless paired with a clear risk condition.

## Category Risk Card

**Purpose**: Shows category-level spending risk without requiring mental math.

**Fields**:

- `categoryName`: Existing display name.
- `limit`: Planned category amount.
- `spent`: Recorded spending amount.
- `remaining`: Remaining amount or negative deficit.
- `usagePercent`: Percent of limit consumed.
- `state`: Existing category state: `safe`, `warning`, `limitReached`, or
  `overLimit`.
- `stateLabel`: Human-readable state label.
- `stateDescription`: Short state description.

**Validation Rules**:

- Remaining amount, usage percentage, and state label must be directly visible.
- Limit and spent remain visible as supporting metrics.
- `overLimit` must show exceeded state and negative remaining amount clearly.
- `limitReached` must be distinct from both warning and over-limit.
- A category with no planned limit and recorded spending must be presented as a
  risky planning state.

## Financial State

**Purpose**: Standardizes meaning across dashboard summaries and category cards.

**States**:

- `positive`: Healthy or favorable financial signal.
- `neutral`: Informational state with no favorable or unfavorable implication.
- `warning`: Near-limit or planning attention state.
- `negative`: Over-limit, debt, loss, or excess allocation state.

**Transitions**:

- Budget health can move from `positive` to `warning` to `negative` as remaining
  allocation decreases or over-allocation appears.
- Category risk can move from `safe` to `warning` to `limitReached` to
  `overLimit` as usage increases.
- Patrimony variation can move between `positive`, `neutral`, and `negative`
  based on the latest change amount.
