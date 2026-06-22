# Feature Specification: Dashboard Operational Layout

**Feature Branch**: `[003-dashboard-operational-layout]`

**Created**: 2026-06-22

**Status**: Draft

**Input**: User description: "Refinar o dashboard desktop com resumo principal mais compacto e horizontal, tratamento mais inteligente para valor principal zero, badge de estado mais contextual, diferenciação visual entre patrimonio e orçamento, cards de categoria mais densos sem repetição de uso, título correto para a seção de categorias, sidebar mais refinada, tipografia de números grandes menos técnica, ações contextuais no dashboard e layout desktop em duas colunas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the Dashboard Above the Fold (Priority: P1)

As the local finance user, I want the desktop dashboard to use the first viewport more efficiently so that I can see the primary financial signal and category status without excessive vertical scanning.

**Why this priority**: The dashboard currently communicates the main signal, but the top summary consumes more height than its content requires. A compact first viewport makes the dashboard feel more operational and helps the user reach actionable category information faster.

**Independent Test**: Can be tested by opening the dashboard on a desktop viewport and confirming that the primary summary is compact, horizontally organized, and leaves more category information visible above the fold than the current stacked layout.

**Acceptance Scenarios**:

1. **Given** the user opens the dashboard on desktop with balance and budget data, **When** the first viewport renders, **Then** the primary summary uses a compact horizontal composition with the main label and value grouped separately from state, variation, source, and contextual action.
2. **Given** the dashboard has category cards, **When** the user views the desktop first viewport, **Then** at least part of the category tracking area is visible without scrolling.
3. **Given** the user has no balance data but has budget data, **When** the dashboard opens, **Then** the compact summary still uses the budget fallback without creating a tall empty hero area.

---

### User Story 2 - Understand Financial State Context (Priority: P2)

As the local finance user, I want the primary summary to explain financial state in personal-finance language so that I understand whether the situation is a decline, a neutral state, available capacity, or a spending risk.

**Why this priority**: Generic state labels such as "Negativo" communicate severity but not cause. More contextual wording helps the user understand why the dashboard is calling attention to the current state.

**Independent Test**: Can be tested by viewing summary states for positive, neutral, warning, and negative scenarios and verifying that the badge and supporting text describe the reason for the state.

**Acceptance Scenarios**:

1. **Given** the primary net worth is zero, **When** the summary renders, **Then** the zero value does not dominate the screen as if it were a strong action signal and the supporting text explains the neutral or zero state.
2. **Given** net worth variation is negative, **When** the summary renders, **Then** the state label communicates a decline or loss context rather than only a generic negative label.
3. **Given** the monthly budget is over-allocated, **When** the summary uses budget fallback or budget emphasis, **Then** the state label communicates budget excess or spending risk in a way the user can act on.

---

### User Story 3 - Compare Supporting Sections Efficiently (Priority: P3)

As the local finance user, I want patrimony and budget summaries to have distinct visual roles so that I can compare long-term position and current-month allocation without reading two identical-looking panels.

**Why this priority**: Patrimony and budget answer different questions. If their panels look interchangeable, the user must spend more effort interpreting the dashboard.

**Independent Test**: Can be tested by viewing the desktop dashboard and verifying that patrimony and budget summaries differ in emphasis, accent, and metric hierarchy while preserving familiar labels.

**Acceptance Scenarios**:

1. **Given** the patrimony section is visible, **When** the user scans it, **Then** net worth and variation are emphasized more strongly than supporting asset and debt totals.
2. **Given** the budget section is visible, **When** the user scans it, **Then** unallocated amount and excess allocation are emphasized more strongly than supporting available and allocated totals.
3. **Given** both supporting sections are visible, **When** the user compares them, **Then** they are visually distinct through role, accent, and hierarchy without introducing unrelated colors or decorative effects.

---

### User Story 4 - Act From the Dashboard (Priority: P4)

As the local finance user, I want contextual actions on the dashboard so that I can respond directly to the financial state I am seeing.

**Why this priority**: A dashboard should not only report status; it should direct the user to the most likely next action when the status suggests one.

**Independent Test**: Can be tested by viewing the dashboard in common states and confirming that the available action points to the relevant existing workflow without adding new workflows.

**Acceptance Scenarios**:

1. **Given** the primary issue is spending or category usage, **When** the dashboard renders, **Then** the contextual action helps the user register or review expenses.
2. **Given** the primary issue is budget allocation, **When** the dashboard renders, **Then** the contextual action helps the user adjust the budget.
3. **Given** the primary issue is patrimony freshness or variation, **When** the dashboard renders, **Then** the contextual action helps the user update or review balance data.

---

### User Story 5 - Scan Category Cards Without Repetition (Priority: P5)

As the local finance user, I want category cards to remain dense and avoid repeated metrics so that each card communicates the most useful information with minimal visual noise.

**Why this priority**: The cards now surface remaining amount and usage percentage, but repeating usage in the supporting metrics wastes space that could improve scan speed.

**Independent Test**: Can be tested by viewing category cards and verifying that usage percentage appears once in the primary card area, while supporting metrics add non-duplicative information such as limit, spent, state, or variance.

**Acceptance Scenarios**:

1. **Given** a category card is visible, **When** the user scans it, **Then** remaining amount or deficit and usage percentage are visible once in the primary card area.
2. **Given** supporting metrics are visible, **When** the user reads them, **Then** they do not repeat the same usage percentage already shown in the primary card area.
3. **Given** category cards include safe and attention states, **When** the section title renders, **Then** the title accurately describes the section content even when not every category is in an attention state.

---

### User Story 6 - Navigate With a More Refined Shell (Priority: P6)

As the local finance user, I want the sidebar active state to feel more polished and financial-platform-like so that navigation identity improves without distracting from the dashboard.

**Why this priority**: The sidebar is functional but visually basic. A stronger active state improves orientation and gives the product more distinct character.

**Independent Test**: Can be tested by viewing the desktop sidebar and confirming the active route has a clear but restrained active state using shape, accent, and icon treatment.

**Acceptance Scenarios**:

1. **Given** the user is on the dashboard, **When** the sidebar renders, **Then** the Dashboard item has a clear active indicator beyond text weight alone.
2. **Given** the user scans other navigation items, **When** they compare them to the active item, **Then** inactive items remain quiet and readable.
3. **Given** the sidebar is viewed alongside the dashboard, **When** the user scans the page, **Then** the active navigation treatment supports orientation without competing with financial alerts.

---

### Edge Cases

- The primary summary amount is zero while the comparison is negative: the comparison must receive enough emphasis to explain the risk.
- The primary summary amount is zero with no negative comparison: the dashboard must present a neutral zero state rather than a false alert.
- The user has budget data but no balance snapshot: the compact summary must remain truthful and use budget context.
- The user has no categories: category section copy and empty state must remain accurate.
- All categories are safe: the section title must not imply attention or risk.
- Some categories are warning or over-limit: risk states must remain visible without relying only on color.
- The desktop viewport is wide: the layout should avoid overly long single-column panels.
- The desktop viewport is narrower but still non-mobile: the layout should remain readable without horizontal scrolling.
- The contextual action target is unavailable because relevant data is missing: the dashboard should offer the next setup action instead of a dead end.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The desktop dashboard MUST use a more operational layout that reduces vertical stacking and prioritizes first-viewport scannability.
- **FR-002**: The primary financial summary MUST use a compact horizontal composition on desktop.
- **FR-003**: The primary summary MUST group the main label and amount separately from state, variation, data source, and contextual action.
- **FR-004**: When the primary amount is zero, the dashboard MUST avoid making the zero value the only dominant signal if a more meaningful comparison or state explanation is available.
- **FR-005**: State labels in the primary summary MUST describe the cause or context of the state, such as decline, budget excess, available capacity, or neutral zero state.
- **FR-006**: The dashboard MUST provide at least one contextual action that routes the user to an existing relevant workflow.
- **FR-007**: Contextual actions MUST be selected or worded according to the visible financial state when enough data exists.
- **FR-008**: Patrimony and budget summaries MUST remain distinct sections with different visual roles and metric emphasis.
- **FR-009**: Patrimony summary MUST emphasize net worth and variation more than supporting assets and debts.
- **FR-010**: Budget summary MUST emphasize unallocated amount and excess allocation more than supporting available and allocated amounts.
- **FR-011**: Category cards MUST avoid repeating usage percentage in both the primary card area and supporting metric area.
- **FR-012**: Category cards MUST retain remaining amount or deficit, usage percentage, limit, spent amount, and state visibility.
- **FR-013**: The category section title MUST accurately describe the content regardless of whether categories are safe, warning, limit reached, or over limit.
- **FR-014**: The sidebar active route state MUST be visually clear through more than text weight alone.
- **FR-015**: Large primary financial values SHOULD feel less technical than dense table/card values while preserving easy numeric comparison.
- **FR-016**: The dashboard MUST preserve existing financial terminology, navigation destinations, loading states, empty states, and error-state patterns.
- **FR-017**: The dashboard MUST preserve the established dark financial visual direction and restrained financial-platform aesthetic.
- **FR-018**: The dashboard MUST remain visibly ready within the existing 1-second performance expectation for the documented personal-use data scale.

### Key Entities *(include if feature involves data)*

- **Operational Dashboard Layout**: The desktop arrangement of summary, categories, supporting sections, and actions that determines what is visible in the first viewport.
- **Compact Primary Summary**: The top-level financial signal with primary amount, contextual state, variation, data source, and action.
- **Contextual Dashboard Action**: A user-facing action that routes to an existing workflow relevant to the current financial state.
- **Supporting Finance Section**: A patrimony or budget summary with differentiated role, metric hierarchy, and visual accent.
- **Category Tracking Section**: The group of category cards with a title that accurately reflects whether the content is general monthly tracking or filtered attention.
- **Navigation Active State**: The visible treatment indicating the current route in the sidebar.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a standard desktop viewport, users can identify the primary financial state and one relevant next action within 5 seconds.
- **SC-002**: On a standard desktop viewport, at least part of the category tracking section is visible without scrolling when dashboard data exists.
- **SC-003**: Users can correctly explain why the primary summary is positive, neutral, warning, or negative in at least 90% of manual review scenarios.
- **SC-004**: Users can distinguish patrimony and budget supporting sections in at least 90% of manual review scenarios without reading every metric label.
- **SC-005**: Category cards show no duplicated usage percentage while preserving all required risk and financial information.
- **SC-006**: The active sidebar item is identifiable without relying on text weight alone.
- **SC-007**: The dashboard remains visibly ready within 1 second for the documented personal-use data scale.

## Assumptions

- This feature focuses on desktop dashboard refinement; mobile behavior should not regress, but mobile redesign is outside this spec.
- No new financial calculations or persisted user data are required.
- Contextual dashboard actions route to existing app workflows rather than introducing new workflows.
- The dark financial visual direction remains the product's visual contract.
- The category section should describe all visible category cards unless a later feature explicitly adds filtering.
