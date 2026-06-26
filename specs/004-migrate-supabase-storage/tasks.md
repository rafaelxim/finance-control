# Tasks: Migrar Persistencia Remota

**Input**: Design documents from `/specs/004-migrate-supabase-storage/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Required by the Finance Control Constitution for all behavior changes. Test tasks are listed before implementation tasks in each story.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently after the shared foundation is complete.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare Supabase tooling, dependency metadata, and local file structure used by all stories.

- [X] T001 Verify current Supabase CLI command surface with `supabase --help` and document any CLI version constraints in specs/004-migrate-supabase-storage/quickstart.md
- [X] T002 Install pinned Supabase packages for the Vue app in package.json and update the lockfile at pnpm-lock.yaml
- [X] T003 Create Supabase project structure with `supabase init` if missing, producing supabase/config.toml
- [X] T004 Create schema migration placeholder using `supabase migration new init_finance_remote_schema` under supabase/migrations/
- [X] T005 [P] Create remote storage directory structure in src/storage/supabase/
- [X] T006 [P] Create Supabase test fixture directory in tests/fixtures/supabase/
- [X] T007 [P] Create remote persistence integration test directory in tests/integration/storage/
- [X] T008 [P] Create migration script directory in scripts/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish schema, typed client, mapping utilities, and validation gates required before any story can use remote persistence.

**Critical**: No user story work should begin until this phase is complete.

- [X] T009 Add required environment variable documentation for VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.example
- [X] T010 Define Supabase client factory and environment validation in src/storage/supabase/client.ts
- [X] T011 Define generated or hand-maintained Supabase database type boundary in src/storage/supabase/database.types.ts
- [X] T012 Define shared Supabase repository error mapping in src/storage/supabase/errors.ts
- [X] T013 Define app-to-database and database-to-app mappers for profile, budgets, categories, expenses, snapshots, items, and preferences in src/storage/supabase/mappers.ts
- [X] T014 [P] Add unit tests for Supabase mapper round trips in tests/unit/storage/supabase/mappers.test.ts
- [X] T015 [P] Add unit tests for Supabase error normalization in tests/unit/storage/supabase/errors.test.ts
- [X] T016 Implement finance schema tables, primary keys, foreign keys, enum checks, unique month constraints, and query indexes in the migration under supabase/migrations/
- [X] T017 Implement explicit grants for anon and service_role Data API access in the migration under supabase/migrations/
- [X] T018 Implement RLS enablement and no-auth single-user policies for every exposed table in the migration under supabase/migrations/
- [X] T019 Add Supabase schema contract verification SQL for tables, keys, grants, and RLS in tests/integration/storage/supabase-schema.test.ts
- [X] T020 Add remote repository test harness with injectable Supabase client doubles in tests/fixtures/supabase/client.ts
- [X] T021 Add backup payload fixture loader for backup.json in tests/fixtures/backup-payload.ts
- [X] T022 Replace IndexedDB-only database setup assumptions in tests/unit/setup.ts with storage-neutral reset hooks
- [X] T023 Run Supabase security and performance advisors through MCP or CLI and record baseline expectations in specs/004-migrate-supabase-storage/quickstart.md

**Checkpoint**: Supabase schema, client boundary, mappers, and verification harness are ready.

---

## Phase 3: User Story 1 - Usar dados persistidos remotamente (Priority: P1) MVP

**Goal**: All primary finance flows read and write through Supabase-backed repositories instead of IndexedDB/Dexie.

**Independent Test**: Create or edit budget, category, expense, balance snapshot, and balance item records; clear browser-local finance data; reload; verify records remain visible through dashboard, budget, expenses, balance, evolution, settings, export, and import flows.

### Tests for User Story 1

- [X] T024 [P] [US1] Add budget remote repository contract tests for month lookup, ordered categories, save, and history preservation in tests/integration/storage/budget.repository.test.ts
- [X] T025 [P] [US1] Add expense remote repository contract tests for budget/month lookup, save, delete, and invalid reference failures in tests/integration/storage/expense.repository.test.ts
- [X] T026 [P] [US1] Add balance remote repository contract tests for month lookup, latest snapshot, save, delete item, and ordered history in tests/integration/storage/balance.repository.test.ts
- [X] T027 [P] [US1] Add profile and preferences remote repository contract tests for missing profile defaults and singleton preference persistence in tests/integration/storage/profile-preferences.repository.test.ts
- [X] T028 [P] [US1] Add export/import remote round-trip tests using remote repositories in tests/integration/storage/data-export.test.ts
- [X] T029 [P] [US1] Add Playwright reload-after-local-clear scenario for remote persistence in tests/e2e/remote-persistence.spec.ts
- [X] T030 [P] [US1] Add performance regression coverage for seeded remote history in tests/e2e/performance-history.spec.ts

### Implementation for User Story 1

- [X] T031 [US1] Implement shared Supabase query helpers for single-row, list, upsert, delete, and ordered reads in src/storage/supabase/query-helpers.ts
- [X] T032 [US1] Replace Dexie budget persistence with Supabase-backed reads and writes in src/storage/budget.repository.ts
- [X] T033 [US1] Replace Dexie expense persistence with Supabase-backed reads and writes in src/storage/expense.repository.ts
- [X] T034 [US1] Replace Dexie balance persistence with Supabase-backed reads and writes in src/storage/balance.repository.ts
- [X] T035 [US1] Replace profile persistence with Supabase-backed default/load/save behavior in src/stores/profile.store.ts
- [X] T036 [US1] Replace localStorage visual preference persistence with Supabase-backed singleton persistence in src/storage/data-export.repository.ts
- [X] T037 [US1] Replace exportLocalData and importLocalData internals with remote repository orchestration in src/storage/data-export.repository.ts
- [X] T038 [US1] Remove primary Dexie database dependency from runtime repository imports in src/storage/database.ts
- [X] T039 [US1] Preserve existing Pinia store loading, saving, and error behavior after repository replacement in src/stores/budget.store.ts
- [X] T040 [US1] Preserve existing Pinia store loading, saving, and error behavior after repository replacement in src/stores/expenses.store.ts
- [X] T041 [US1] Preserve existing Pinia store loading, saving, and error behavior after repository replacement in src/stores/balance.store.ts
- [X] T042 [US1] Ensure Dashboard, Budget, Expenses, Balance, Evolution, and Settings pages still surface existing loading, empty, and error components in src/pages/DashboardPage.vue, src/pages/BudgetPage.vue, src/pages/ExpensesPage.vue, src/pages/BalancePage.vue, src/pages/EvolutionPage.vue, and src/pages/SettingsPage.vue
- [X] T043 [US1] Ensure route-level remote data reload behavior remains consistent in src/app/router/index.ts
- [X] T044 [US1] Update export/import e2e expectations from local backup storage to remote-backed data in tests/e2e/export-import.spec.ts
- [X] T045 [US1] Validate User Story 1 against remote-repository-contract.md and record any contract deviations in specs/004-migrate-supabase-storage/contracts/remote-repository-contract.md

**Checkpoint**: User Story 1 is independently functional and no primary finance flow depends on IndexedDB for reads or writes.

---

## Phase 4: User Story 2 - Migrar o backup existente (Priority: P2)

**Goal**: Load every valid record from backup.json into Supabase safely, preserving IDs, references, timestamps, values, and retry idempotency.

**Independent Test**: Start with an empty remote dataset, run the backup migration twice, and verify counts stay at 3 monthly budgets, 16 categories, 7 expenses, 2 balance snapshots, and 6 balance items with all references valid.

### Tests for User Story 2

- [X] T046 [P] [US2] Add backup migration validation tests for expected backup.json counts and schema version in tests/integration/storage/backup-migration.test.ts
- [X] T047 [P] [US2] Add backup migration idempotency tests that run the same payload twice in tests/integration/storage/backup-migration.test.ts
- [X] T048 [P] [US2] Add backup migration reference failure tests for missing budget, category, and snapshot references in tests/integration/storage/backup-migration.test.ts
- [X] T049 [P] [US2] Add Playwright migrated-data smoke coverage for navigating migrated months in tests/e2e/backup-migration.spec.ts

### Implementation for User Story 2

- [X] T050 [US2] Implement backup payload validation entrypoint using existing data export schemas in src/storage/supabase/backup-migration.ts
- [X] T051 [US2] Implement dependency-ordered upsert migration for profile, preferences, monthly budgets, categories, expenses, snapshots, and items in src/storage/supabase/backup-migration.ts
- [X] T052 [US2] Implement post-migration count and relationship verification in src/storage/supabase/backup-migration.ts
- [X] T053 [US2] Implement CLI migration runner that reads backup.json and calls the backup migration entrypoint in scripts/migrate-backup-to-supabase.ts
- [X] T054 [US2] Add npm script for backup migration execution in package.json
- [X] T055 [US2] Add disposable remote/local cleanup helper for migration tests in tests/fixtures/supabase/reset-remote-data.ts
- [X] T056 [US2] Wire backup migration fixture data into performance and migration e2e setup in tests/fixtures/five-year-history.ts
- [X] T057 [US2] Update Settings import workflow to use idempotent remote import semantics in src/pages/SettingsPage.vue
- [X] T058 [US2] Update DataBackupPanel success and failure assertions for remote migration/import behavior in tests/e2e/export-import.spec.ts
- [X] T059 [US2] Validate User Story 2 against backup-migration-contract.md and record any contract deviations in specs/004-migrate-supabase-storage/contracts/backup-migration-contract.md

**Checkpoint**: backup.json can seed Supabase completely and safely, including retry without duplicates.

---

## Phase 5: User Story 3 - Continuar sem autenticacao (Priority: P3)

**Goal**: The migrated application remains usable without login while making public-client database access explicit and recoverable failures visible.

**Independent Test**: Open a fresh browser session, visit every primary route, save representative data, and verify no login, registration, logout, account switch, or credentials are required; simulate remote failure and verify recoverable error states.

### Tests for User Story 3

- [X] T060 [P] [US3] Add Playwright no-auth route access coverage across primary routes in tests/e2e/no-auth-supabase.spec.ts
- [X] T061 [P] [US3] Add repository failure-state tests for denied reads, denied writes, and network-style errors in tests/integration/storage/remote-error-states.test.ts
- [X] T062 [P] [US3] Add schema policy tests confirming anon role CRUD access and no auth screens are required in tests/integration/storage/supabase-schema.test.ts

### Implementation for User Story 3

- [X] T063 [US3] Ensure Supabase client initialization uses only VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in src/storage/supabase/client.ts
- [X] T064 [US3] Add user-facing remote failure normalization for load/save operations in src/storage/supabase/errors.ts
- [X] T065 [US3] Ensure settings, dashboard, budget, expense, balance, and evolution flows do not introduce login or account controls in src/components/layout/AppShell.vue
- [X] T066 [US3] Add explicit documentation of the no-auth shared-data security tradeoff in specs/004-migrate-supabase-storage/research.md
- [X] T067 [US3] Re-run Supabase security advisors after policy implementation and document results in specs/004-migrate-supabase-storage/quickstart.md

**Checkpoint**: All migrated flows remain no-auth and expose recoverable remote failures through existing UX patterns.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality, security, performance, and documentation validation across all stories.

- [X] T068 [P] Remove Dexie and fake-indexeddb dependencies if no remaining runtime or test imports require them in package.json
- [X] T069 [P] Remove obsolete IndexedDB integration tests or rewrite their remaining value as Supabase schema tests in tests/integration/storage/database.test.ts
- [X] T070 [P] Update README setup notes for Supabase environment variables, migration workflow, and backup seeding in README.md
- [X] T071 Run type checking and fix issues reported by npm run typecheck across src/
- [X] T072 Run linting and fix issues reported by npm run lint across src/ and tests/
- [X] T073 Run unit and integration tests and fix failures reported by npm run test:unit across tests/
- [X] T074 Run Playwright e2e coverage and fix failures reported by npm run test:e2e across tests/e2e/
- [X] T075 Run production build and fix failures reported by npm run build across src/
- [X] T076 Validate quickstart.md end-to-end and update any stale command or expectation in specs/004-migrate-supabase-storage/quickstart.md
- [X] T077 Run final Supabase security and performance advisors through MCP or CLI and document zero unresolved findings in specs/004-migrate-supabase-storage/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundation; MVP and primary migration of runtime persistence.
- **User Story 2 (Phase 4)**: Depends on Foundation and benefits from US1 repository primitives; can be implemented after the shared migration helpers exist.
- **User Story 3 (Phase 5)**: Depends on Foundation; can run in parallel with US1/US2 once schema/client behavior exists, but final advisor checks depend on policy implementation.
- **Polish (Phase 6)**: Depends on all desired user stories.

### User Story Dependencies

- **US1 (P1)**: First MVP after Foundation; no dependency on US2 or US3.
- **US2 (P2)**: Depends on Foundation and uses the same remote tables/mappers as US1; independently testable with the migration runner.
- **US3 (P3)**: Depends on Foundation and validates the no-auth constraint across US1/US2 behavior.

### Within Each User Story

- Tests are written before implementation tasks.
- Supabase schema and mapper tasks precede repository implementation.
- Repository implementation precedes store/page integration.
- Migration validation precedes migration runner usage.
- Advisor and performance checks run after schema/policy implementation.

## Parallel Opportunities

- Setup tasks T005-T008 can run in parallel after T001-T004 are understood.
- Foundation tests T014-T015 can run in parallel with schema drafting T016-T018 once mapper/client contracts are known.
- US1 test tasks T024-T030 can run in parallel.
- US1 repository implementation T032-T034 can run in parallel after T031.
- US2 test tasks T046-T049 can run in parallel.
- US3 test tasks T060-T062 can run in parallel.
- Polish tasks T068-T070 can run in parallel before final validation commands.

## Parallel Example: User Story 1

```text
Task: "T024 [P] [US1] Add budget remote repository contract tests in tests/integration/storage/budget.repository.test.ts"
Task: "T025 [P] [US1] Add expense remote repository contract tests in tests/integration/storage/expense.repository.test.ts"
Task: "T026 [P] [US1] Add balance remote repository contract tests in tests/integration/storage/balance.repository.test.ts"
Task: "T027 [P] [US1] Add profile and preferences tests in tests/integration/storage/profile-preferences.repository.test.ts"
Task: "T029 [P] [US1] Add Playwright reload-after-local-clear scenario in tests/e2e/remote-persistence.spec.ts"
```

## Parallel Example: User Story 2

```text
Task: "T046 [P] [US2] Add backup count validation tests in tests/integration/storage/backup-migration.test.ts"
Task: "T047 [P] [US2] Add idempotency tests in tests/integration/storage/backup-migration.test.ts"
Task: "T048 [P] [US2] Add reference failure tests in tests/integration/storage/backup-migration.test.ts"
Task: "T049 [P] [US2] Add migrated-data smoke coverage in tests/e2e/backup-migration.spec.ts"
```

## Parallel Example: User Story 3

```text
Task: "T060 [P] [US3] Add no-auth route access coverage in tests/e2e/no-auth-supabase.spec.ts"
Task: "T061 [P] [US3] Add repository failure-state tests in tests/integration/storage/remote-error-states.test.ts"
Task: "T062 [P] [US3] Add schema policy tests in tests/integration/storage/supabase-schema.test.ts"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundation.
3. Complete Phase 3 User Story 1.
4. Stop and validate: remote repositories read/write all primary finance data after clearing browser-local state.

### Incremental Delivery

1. Foundation: Supabase schema, grants/RLS, typed client, mappers, and test harness.
2. US1: Runtime persistence moves from IndexedDB to Supabase.
3. US2: backup.json migration and idempotent seed workflow.
4. US3: no-auth UX and public-client security/failure validation.
5. Polish: dependency cleanup, docs, full test/build/advisor validation.

### Team Parallel Strategy

After Foundation:
- Developer A: US1 repository and store migration.
- Developer B: US2 backup migration runner and verification.
- Developer C: US3 no-auth/failure-state validation and advisor checks.

Each story remains independently testable against its acceptance criteria before final integration.
