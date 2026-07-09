<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/004-migrate-supabase-storage/plan.md
<!-- SPECKIT END -->

## Supabase Data Safety

Do not alter, delete, truncate, reset, seed over, or otherwise modify existing
Supabase data unless the user explicitly requests that specific action and
approves it before execution. Prefer read-only inspection by default, and ask
for confirmation before running any command, test, migration helper, UI flow, or
script that may change already-registered Supabase records.

## Test Execution

Do not create, modify, or execute tests unless the user explicitly requests
tests for the current task.
