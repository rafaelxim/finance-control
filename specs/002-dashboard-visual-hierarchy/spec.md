# Feature Specification: Dashboard Visual Hierarchy

**Feature Branch**: `[002-dashboard-visual-hierarchy]`

**Created**: 2026-06-22

**Status**: Draft

**Input**: User description: "Agrupar em uma unica spec as melhorias de design do dashboard: hero financeiro compacto, separacao visual entre patrimonio e orcamento, ajuste de raio e densidade dos cards, tipografia dos valores financeiros, e cards de categoria com melhor hierarquia."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand the Month at a Glance (Priority: P1)

As the local finance user, I want the dashboard to immediately show the most important financial indicator for the current month so that I can understand my overall situation before reading detailed sections.

**Why this priority**: The dashboard's first job is orientation. Without a clear primary financial signal, the user must scan several equally weighted summaries before knowing whether the month is healthy, neutral, or risky.

**Independent Test**: Can be tested by opening the dashboard with current budget and balance data and verifying that one compact top summary communicates the primary amount, monthly change, and state before the detailed cards.

**Acceptance Scenarios**:

1. **Given** the user has current budget and balance data, **When** the dashboard opens, **Then** the first content area shows a single primary financial amount with its monthly change and a clear positive, neutral, or negative visual state.
2. **Given** the user has no recent balance snapshot but has budget data, **When** the dashboard opens, **Then** the top summary still presents the most relevant available monthly budget indicator without showing misleading balance information.
3. **Given** the primary financial state is negative or risky, **When** the user views the top summary, **Then** the risk state is visually noticeable without requiring the user to read every supporting metric.

---

### User Story 2 - Compare Net Worth and Budget Sections (Priority: P2)

As the local finance user, I want the dashboard to separate patrimony and monthly budget information clearly so that I can compare long-term financial position and current-month spending without confusing their meanings.

**Why this priority**: Patrimony and budget answer different financial questions. Clear section hierarchy reduces misreading and makes repeated dashboard checks faster.

**Independent Test**: Can be tested by opening the dashboard and verifying that patrimony and budget summaries have distinct section labels, visual roles, and color semantics for assets, debts, available funds, unallocated funds, and excess allocation.

**Acceptance Scenarios**:

1. **Given** the user has assets, debts, and budget totals, **When** the dashboard renders, **Then** patrimony metrics and monthly budget metrics appear as separate, clearly labeled sections.
2. **Given** the user has assets and debts of different amounts, **When** the patrimony section renders, **Then** assets, debts, net worth, and variation are distinguishable by label, hierarchy, and appropriate financial state.
3. **Given** the user's budget has unallocated or over-allocated amounts, **When** the budget section renders, **Then** available, allocated, unallocated, and excess amounts use visual emphasis that reflects their financial meaning.

---

### User Story 3 - Scan Category Risk Quickly (Priority: P3)

As the local finance user, I want category cards to emphasize remaining amount, usage percentage, and risk state so that I can identify which categories need attention without calculating from limit and spent values.

**Why this priority**: Category cards are the operational part of the dashboard. They should help the user decide where to reduce spending or investigate, not just display raw totals.

**Independent Test**: Can be tested by viewing categories in safe, warning, limit reached, and over-limit states and verifying that each card's remaining amount, usage percentage, progress, and state are readable at a glance.

**Acceptance Scenarios**:

1. **Given** a category is close to its monthly limit, **When** the dashboard displays its card, **Then** the warning state, remaining amount, and usage percentage are more prominent than secondary details.
2. **Given** a category is over its monthly limit, **When** the dashboard displays its card, **Then** the exceeded state is visually distinct and the amount over or remaining deficit is easy to identify.
3. **Given** a category is safely below its monthly limit, **When** the dashboard displays its card, **Then** the card communicates that the category is healthy without competing visually with warning or over-limit cards.

---

### User Story 4 - Read Financial Values Comfortably (Priority: P4)

As the local finance user, I want monetary values to have consistent readable typography so that I can compare amounts quickly across the dashboard on desktop and mobile.

**Why this priority**: Finance dashboards rely on numeric comparison. Inconsistent or overly heavy number styling slows scanning and weakens confidence in the interface.

**Independent Test**: Can be tested by reviewing the dashboard at desktop and mobile sizes and verifying that primary, secondary, and supporting amounts have consistent hierarchy, alignment, and readable weight.

**Acceptance Scenarios**:

1. **Given** the dashboard shows primary and secondary monetary values, **When** the user scans the page, **Then** the most important value is visually dominant while supporting values remain readable but less prominent.
2. **Given** values have different lengths, **When** the dashboard is viewed on a narrow screen, **Then** monetary text remains readable and does not overlap adjacent labels, badges, or metrics.
3. **Given** the user compares values across sections, **When** values appear in summaries and cards, **Then** their typography follows a consistent hierarchy and numeric alignment.

---

### Edge Cases

- The dashboard has no budget categories yet: the empty state must remain clear and must not be visually crowded by the new hierarchy.
- The dashboard has budget data but no balance snapshot: patrimony-specific values must not imply that a recent snapshot exists.
- The dashboard has balance data but no current budget categories: the top financial summary must still provide useful orientation from available data.
- One or more monetary values are zero: neutral values must not be presented as positive or negative risk.
- A category has no planned limit and recorded spending: the card must identify this as a risky planning state rather than a normal safe state.
- A category is exactly at its limit: the state must be distinct from both safe and over-limit.
- Category names or monetary values are long: text must fit without overlapping badges, progress indicators, or neighboring metrics.
- The user views the dashboard on a mobile viewport: section order, primary amounts, and category risk states must remain understandable without horizontal scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dashboard MUST present a compact top financial summary before detailed dashboard sections.
- **FR-002**: The top financial summary MUST display one primary financial amount, one related monthly change or contextual comparison when available, and a clear positive, neutral, warning, or negative state.
- **FR-003**: When the preferred top-summary data is unavailable, the dashboard MUST fall back to the most relevant available monthly finance indicator without showing unknown values as real amounts.
- **FR-004**: The dashboard MUST visually separate patrimony information from monthly budget information through section labels, hierarchy, and spacing.
- **FR-005**: Patrimony metrics MUST distinguish assets, debts, net worth, and variation using labels and financial state semantics.
- **FR-006**: Budget metrics MUST distinguish available amount, allocated amount, unallocated amount, and excess allocation using labels and financial state semantics.
- **FR-007**: Financial state colors MUST consistently communicate positive remaining balance, warning proximity to a limit, reached limit, and exceeded limit across dashboard summaries and category cards.
- **FR-008**: The dashboard MUST use the established financial visual direction for dark surfaces, primary emphasis, positive states, and negative states.
- **FR-009**: Dashboard cards MUST use a denser financial layout with restrained rounding, consistent spacing, and clear boundaries between repeated items.
- **FR-010**: Monetary values MUST follow a consistent type hierarchy that distinguishes primary, secondary, and supporting values.
- **FR-011**: Monetary values MUST remain legible and aligned for common Brazilian Real formats, including zero values, negative values, and values with thousands separators.
- **FR-012**: Category cards MUST make remaining amount, usage percentage, progress toward limit, and risk state directly visible.
- **FR-013**: Category cards MUST keep limit and spent values available as supporting metrics.
- **FR-014**: Category cards MUST provide distinct visual treatments for safe, warning, limit reached, and over-limit states.
- **FR-015**: The dashboard MUST preserve existing navigation labels, financial terminology, loading behavior, empty states, and error-state patterns for affected workflows.
- **FR-016**: The dashboard MUST remain usable on desktop and mobile viewports without text overlap, clipped monetary values, or horizontal scrolling in the main content.
- **FR-017**: The dashboard MUST remain responsive for the existing personal-use data scale of multiple years of history, monthly budgets, expense categories, expenses, balance items, and balance snapshots.

### Key Entities *(include if feature involves data)*

- **Dashboard Financial Summary**: The top-level financial signal for the current dashboard view. It includes a primary amount, contextual change or comparison, and a state that helps the user orient quickly.
- **Patrimony Summary**: A grouped presentation of assets, debts, net worth, and recent net worth variation.
- **Budget Summary**: A grouped presentation of available monthly funds, allocated funds, unallocated funds, and excess allocation.
- **Category Risk Card**: A category-level budget status view showing limit, spent amount, remaining amount, usage percentage, progress, and risk state.
- **Financial State**: A user-facing classification such as positive, neutral, warning, limit reached, or exceeded that determines how financial meaning is communicated visually.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can identify the dashboard's primary financial state within 5 seconds of opening the page.
- **SC-002**: A user can correctly distinguish patrimony metrics from monthly budget metrics in at least 90% of manual review scenarios.
- **SC-003**: A user can identify all warning or over-limit categories from the dashboard without manually subtracting spent from limit.
- **SC-004**: All monetary values visible on the dashboard remain readable without overlap or horizontal scrolling at a 360px-wide viewport and a standard desktop viewport.
- **SC-005**: Safe, warning, limit reached, and over-limit category states are visually distinguishable without relying on color alone.
- **SC-006**: The dashboard remains visibly ready within 1 second for the documented personal-use data scale.
- **SC-007**: Existing loading, empty, and no-data situations remain understandable and include no misleading financial values.

## Assumptions

- The target user is the existing single local user who checks personal finances repeatedly across desktop and mobile browsers.
- The feature changes dashboard presentation and hierarchy only; it does not introduce new financial calculations beyond presenting already available summary, budget, expense, and balance information.
- The established dark financial visual direction remains the product's visual contract.
- Brazilian Real remains the monetary display format for all affected dashboard values.
- The dashboard should prefer truthful absence of data over placeholder amounts when a budget, category list, or balance snapshot is missing.
