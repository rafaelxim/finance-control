# Research: Dashboard Operational Layout

## Decision: Use a desktop two-column dashboard layout with a compact primary row

**Rationale**: The current dashboard is clear but vertically stacked. A
two-column desktop arrangement lets categories and the primary signal occupy the
main working area while patrimony and budget summaries become supporting panels.
This better matches repeated finance-checking behavior and improves first
viewport scannability.

**Alternatives considered**:

- Keep a single stacked column: rejected because it keeps the category section
  lower than necessary on desktop.
- Move categories to a secondary page: rejected because category risk is a core
  dashboard decision signal.

## Decision: Keep actions as links to existing workflows

**Rationale**: The app already has routes for expenses, budget, and balance.
Contextual dashboard actions should guide users to those workflows instead of
creating new flows or persistence.

**Alternatives considered**:

- Add inline dashboard editing: rejected because it expands scope and risks
  duplicating existing forms.
- Add configurable dashboard actions: rejected because no customization need is
  specified and it would require persistence.

## Decision: Make state labels cause-oriented

**Rationale**: Labels such as "Negativo" communicate severity but not cause.
Labels like "Patrimônio caiu", "Orçamento excedido", "Saldo disponível", and
"Patrimônio zerado" tell the user why the dashboard is drawing attention.

**Alternatives considered**:

- Keep generic state labels: rejected because they are less actionable.
- Use long explanatory sentences inside the badge: rejected because badges must
  remain compact and scannable.

## Decision: Reduce the hero-like treatment when the primary amount is zero

**Rationale**: A large zero can dominate the page without communicating action.
When zero is paired with a meaningful variation or risk, the comparison and
state explanation should carry more of the hierarchy.

**Alternatives considered**:

- Always use the same large type scale: rejected because zero states require
  different interpretation than high positive or negative values.
- Hide zero values entirely: rejected because finance dashboards should remain
  truthful and explicit.

## Decision: De-duplicate category usage metrics

**Rationale**: Usage percentage is already visible in the card focus area.
Repeating it in supporting metrics wastes space and weakens density. Supporting
metrics should add distinct information such as limit, spent, state, or
variance.

**Alternatives considered**:

- Keep repeated usage for redundancy: rejected because the state badge and
  progress bar already provide redundancy.
- Remove usage percentage entirely: rejected because usage is a fast risk scan
  signal.

## Decision: Refine sidebar active state without changing navigation structure

**Rationale**: The existing sidebar is stable and accessible. A restrained
active accent, icon color treatment, and subtle shape change can improve
orientation without changing routes or interaction patterns.

**Alternatives considered**:

- Redesign navigation as top tabs: rejected because the current app shell is
  stable across pages.
- Add decorative navigation effects: rejected because they would compete with
  financial status colors.
