# Research: Dashboard Visual Hierarchy

## Decision: Treat the feature as presentation-only unless a small derived helper is necessary

**Rationale**: The current stores already expose budget totals, latest balance
evolution, and category progress. The requested changes are about hierarchy,
state communication, and readability, not new financial calculations or storage.

**Alternatives considered**:

- Add persisted dashboard preferences: rejected because the spec does not
  require customization and persistence would expand scope.
- Add a dedicated dashboard store: rejected unless implementation discovers
  repeated derived logic that cannot remain readable in `DashboardPage.vue`.

## Decision: Prefer a top summary that uses latest net worth when available and budget health as fallback

**Rationale**: Net worth is the broadest financial signal when balance snapshots
exist. When no balance snapshot exists, the dashboard can still orient the user
with monthly budget health using available, unallocated, or over-allocated
amounts. This satisfies the no-misleading-values requirement.

**Alternatives considered**:

- Always show net worth: rejected because users without a balance snapshot would
  see an empty or misleading hero.
- Always show monthly budget: rejected because patrimony data provides a better
  overall financial signal when available.

## Decision: Use existing financial color semantics with non-color labels

**Rationale**: The project already defines the product color language:
primary yellow, positive green, and negative red. The category cards already
include text labels like "Seguro" and "Limite excedido", which should remain so
state is not communicated by color alone.

**Alternatives considered**:

- Introduce a new accent palette: rejected because it would weaken the existing
  financial visual direction and increase design-system surface area.
- Use color-only risk signaling: rejected because it fails accessibility and the
  feature success criteria.

## Decision: Tighten density through existing tokens and scoped component styles

**Rationale**: The current dashboard has a clear structure but repeated panels
share similar weight and some card rounding is softer than the documented
financial style. Reducing radius and improving spacing can make the UI feel more
operational without changing workflows.

**Alternatives considered**:

- Full design-system rewrite: rejected as too broad for a dashboard hierarchy
  feature.
- Keep all existing spacing and only add the hero: rejected because it would not
  resolve section similarity or card hierarchy.

## Decision: Validate with component tests plus dashboard-oriented Playwright checks

**Rationale**: Unit/component tests can lock in labels, states, fallback content,
and monetary rendering. Playwright is better suited to verify dashboard order,
mobile fit, and end-to-end category state visibility with real interactions.

**Alternatives considered**:

- Manual-only visual review: rejected because this dashboard has financial trust
  implications and existing test infrastructure is already present.
- Screenshot-only tests: rejected because accessible labels and state text are
  more stable than pixel-level assertions for this feature.
