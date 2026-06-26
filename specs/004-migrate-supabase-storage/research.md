# Research: Migrar Persistencia Remota

## Decision: Use Supabase Postgres/Data API as the app persistence boundary

Rationale: The user explicitly selected Supabase and the configured project is
reachable through MCP. The current app already isolates persistence behind
repositories, so replacing Dexie-backed implementations with Supabase-backed
repositories preserves most store and UI contracts. Supabase documentation
confirms tables, views, and functions can be exposed through the Data API and
queried from the JavaScript client.

Alternatives considered:
- Keep IndexedDB as primary and sync later: rejected because the feature asks to
  migrate everything currently pointing at IndexedDB.
- Add a custom backend: rejected because the current project is a browser-only
  SPA and no server behavior is required for the stated scope.
- Use Edge Functions for all CRUD: rejected for this phase because direct Data
  API access is simpler and sufficient for a single shared unauthenticated data
  space.

## Decision: Use the publishable key in browser code, never secret keys

Rationale: Supabase currently recommends publishable keys for public clients,
and the MCP project exposes an enabled `sb_publishable_...` key. Secret keys and
legacy service-role keys bypass or exceed normal client privileges and must stay
out of browser code and source control.

Alternatives considered:
- Use the legacy anon key: compatible, but the publishable key is the current
  recommended client-facing key model.
- Use a secret/service-role key for migration from the browser: rejected because
  it would expose privileged credentials.

## Decision: Keep no-auth UX but make the database policy explicit

Rationale: The spec requires no login for this phase. Because public client
access means the application will operate as the anonymous role, all exposed
tables must have RLS enabled and policies/grants intentionally scoped to this
single-user product. The security tradeoff must be recorded for future auth
work: this phase protects against accidental over-privileged table exposure, not
against another holder of the public app credentials accessing the shared data.
The implemented policies keep CRUD available to `anon` without authentication
and use `(select auth.role()) = 'anon'` expressions so Supabase advisors do not
flag always-true or per-row auth function evaluation warnings.

Alternatives considered:
- Block writes until authentication exists: rejected because the requested
  migration explicitly says no authentication for now.
- Disable RLS for convenience: rejected by Supabase guidance and project
  security requirements.
- Add a custom app API key header/pre-request function now: possible future
  hardening, but outside the product's no-auth UX and not necessary for the
  first migration plan.

## Decision: Create explicit grants for Data API access

Rationale: Supabase changelog entry from 2026-04-28 notes that new tables may no
longer be exposed to Data and GraphQL APIs automatically. Supabase docs also
describe Data API exposure as explicit role privileges. The migration must grant
only the required privileges to `anon` and `service_role`, then verify access
through the same client role used by the SPA.

Alternatives considered:
- Rely on default privileges: rejected because behavior changed for newer
  projects and would make the migration brittle.
- Grant broad default privileges for all future tables: rejected because the
  app has a small known schema and explicit grants are safer.

## Decision: Model existing entities as normalized tables with text IDs

Rationale: The current app already owns stable string IDs in exported data.
Preserving those IDs allows idempotent `upsert` by primary key and keeps
existing references intact. Existing relationships map cleanly to foreign keys:
budgets to categories and expenses, snapshots to balance items. Monetary values
remain decimal strings at the TypeScript boundary while the database can enforce
numeric shape through text checks or numeric columns selected during planning.

Alternatives considered:
- Generate new database IDs: rejected because it complicates backup migration,
  reference preservation, and duplicate prevention.
- Store the full backup as one JSON document: rejected because the app needs
  month/category/expense/snapshot queries and referential validation.

## Decision: Use idempotent backup migration with ordered upserts

Rationale: `backup.json` must be migrated completely and safely. Supabase
JavaScript `.upsert()` supports conflict handling and bulk upsert. Migrating in
dependency order preserves referential integrity: profile/preferences, monthly
budgets, categories, expenses, balance snapshots, balance items. Re-running the
same migration should leave counts unchanged.

Alternatives considered:
- Insert only once and fail on duplicates: rejected because the spec requires
  retry safety.
- Delete all remote data then reinsert: rejected because it risks data loss if
  the remote dataset has been edited after the first migration.
- Use the settings import UI as the only migration path: insufficient because
  the feature needs a verifiable remote seed path from `backup.json`.

## Decision: Use Supabase CLI migrations for schema and MCP/advisors for verification

Rationale: Supabase docs recommend local CLI migrations for database changes and
tracking schema in version control. The configured MCP project is useful for
listing current tables, reading project URL/keys, and running advisors. Current
MCP checks show no `public` tables and no security/performance lints before the
feature starts; advisors must run again after DDL changes.

Alternatives considered:
- Apply schema only through MCP `apply_migration`: useful when no filesystem is
  available, but this repo has a local workspace and should keep migrations in
  source control.
- Make dashboard-only schema changes: rejected because they are harder to
  review and reproduce.

## Decision: Generate or maintain typed database contracts

Rationale: Supabase docs support TypeScript type generation from the database
schema. The app already uses TypeScript and domain interfaces, so generated
database types should either be committed or wrapped by explicit mapper types to
avoid unchecked stringly-typed table access.

Alternatives considered:
- Use untyped client calls everywhere: rejected because finance data mapping
  mistakes are high impact.
- Replace domain types with generated database types globally: rejected because
  existing domain models already express app behavior and should remain stable.

## Decision: Do not require offline-first behavior in this phase

Rationale: The spec assumes remote persistence and only requires recoverable
remote failure states. Keeping offline sync out of scope avoids introducing a
complex conflict-resolution layer while migrating the primary storage backend.

Alternatives considered:
- Keep IndexedDB as offline cache: rejected for this phase because it blurs the
  requirement to move primary reads/writes away from IndexedDB and adds sync
  complexity.
- Add a local write queue: rejected until there is an explicit offline product
  requirement.
