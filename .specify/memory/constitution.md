<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template principle 1 -> I. Code Quality Is Enforced
- Template principle 2 -> II. Testing Defines Done
- Template principle 3 -> III. User Experience Stays Consistent
- Template principle 4 -> IV. Performance Is a Requirement
- Template principle 5 -> V. Simplicity and Maintainability
Added sections:
- Quality Gates
- Development Workflow
Removed sections:
- None
Templates requiring updates:
- UPDATED .specify/templates/plan-template.md
- UPDATED .specify/templates/spec-template.md
- UPDATED .specify/templates/tasks-template.md
- REVIEWED .specify/templates/checklist-template.md
- REVIEWED .specify/extensions/agent-context/commands/speckit.agent-context.update.md
Follow-up TODOs:
- None
-->
# Finance Control Constitution

## Core Principles

### I. Code Quality Is Enforced
All production code MUST be clear, typed where the project language supports it,
linted, formatted, and organized around cohesive modules with explicit
interfaces. Changes MUST follow existing project patterns before introducing new
abstractions, and any new abstraction MUST remove duplication, isolate a
volatile dependency, or simplify a repeated workflow. Dead code, ambiguous
naming, hidden side effects, and broad unrelated refactors MUST NOT be included
in feature changes.

Rationale: finance workflows require predictable behavior and maintainable
change history; unclear code increases the risk of incorrect balances,
categories, reports, or user decisions.

### II. Testing Defines Done
Every behavior change MUST include automated tests at the lowest effective level
and at least one user-story or integration-level verification when behavior spans
modules, persistence, APIs, or UI flows. Tests MUST cover the intended success
path, relevant validation failures, and regression cases for defects being fixed.
Generated tasks MUST include tests before implementation tasks, and a feature is
not complete until the documented test commands pass or the remaining gap is
explicitly justified in the plan.

Rationale: finance data has high user trust impact; tests are the executable
contract that prevents silent regressions.

### III. User Experience Stays Consistent
User-facing changes MUST preserve consistent navigation, terminology, visual
hierarchy, validation patterns, loading states, empty states, and error handling
across the product. New workflows MUST be independently demonstrable from the
user's point of view and MUST avoid adding instructional text in the interface
when a clearer control, state, or layout can communicate the behavior. Specs
MUST define the primary user journey, edge cases, and measurable success
criteria for completion, comprehension, or error recovery.

Rationale: personal finance tools are used repeatedly for comparison,
classification, and decisions; inconsistent UX slows users down and creates
avoidable mistakes.

### IV. Performance Is a Requirement
Each feature plan MUST define performance expectations that match the affected
workflow, including latency, responsiveness, data volume, or resource usage as
applicable. Implementations MUST avoid unnecessary work in render paths,
database queries, network calls, and batch processing. Any feature touching
large transaction lists, summaries, imports, dashboards, or reports MUST include
a performance validation strategy before implementation is considered complete.

Rationale: financial data grows over time, and users expect reporting,
filtering, and entry flows to remain responsive as history accumulates.

### V. Simplicity and Maintainability
The simplest design that satisfies the specification and quality gates MUST be
chosen. Dependencies, services, schemas, and cross-cutting mechanisms MUST be
introduced only when the plan documents the concrete need and the rejected
simpler alternative. Feature slices MUST remain independently deliverable and
testable, with shared infrastructure limited to what is required by current
stories.

Rationale: a small finance product must remain easy to evolve; unnecessary
complexity increases maintenance cost and slows future feature delivery.

## Quality Gates

Plans, specs, tasks, and reviews MUST verify these gates before implementation
is accepted:

- Code quality: formatting, linting, typing or equivalent static checks, and
  localized scope are identified in the plan.
- Testing: unit, integration, contract, or end-to-end coverage is selected based
  on risk, and skipped coverage is justified.
- UX consistency: affected screens, flows, states, and terminology are compared
  with existing patterns.
- Performance: measurable expectations and validation commands or manual checks
  are documented for affected workflows.
- Simplicity: added dependencies, abstractions, or infrastructure are justified
  against a simpler alternative.

## Development Workflow

Feature work MUST start from a user-centered specification with prioritized,
independently testable stories. Implementation plans MUST record technical
context, quality gates, real source paths, performance expectations, and any
constitution violations before coding starts. Task lists MUST order tests before
implementation for each story and include final validation tasks for quality,
UX, and performance. Reviews MUST block changes that violate this constitution
unless the plan documents a time-bound exception and an owner for resolution.

## Governance

This constitution supersedes conflicting local practices, templates, and
generated plans. Amendments MUST be made through a documented change to this
file, include a Sync Impact Report, and update dependent templates in the same
change when their guidance is affected.

Versioning follows semantic versioning:

- MAJOR: backward-incompatible governance changes, removed principles, or
  redefined compliance expectations.
- MINOR: new principles, new required sections, or materially expanded quality
  gates.
- PATCH: wording, clarification, typo fixes, or non-semantic refinements.

Compliance review is required during plan creation, task generation, and code
review. Any approved exception MUST name the violated principle, explain why the
exception is necessary, define compensating validation, and identify when the
exception will be removed.

**Version**: 1.0.0 | **Ratified**: 2026-06-21 | **Last Amended**: 2026-06-21
