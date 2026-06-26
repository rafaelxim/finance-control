import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const initialMigration = readFileSync(
  join(process.cwd(), 'supabase/migrations/20260626152213_init_finance_remote_schema.sql'),
  'utf8'
)
const policyMigration = readFileSync(
  join(process.cwd(), 'supabase/migrations/20260626154500_tighten_no_auth_policy_expressions.sql'),
  'utf8'
)
const policyPerformanceMigration = readFileSync(
  join(process.cwd(), 'supabase/migrations/20260626154800_optimize_no_auth_policy_initplans.sql'),
  'utf8'
)
const migrations = `${initialMigration}\n${policyMigration}\n${policyPerformanceMigration}`

const tables = [
  'profiles',
  'monthly_budgets',
  'budget_categories',
  'expenses',
  'balance_snapshots',
  'balance_items',
  'visual_preferences'
]

describe('Supabase schema migration contract', () => {
  it('creates every required table', () => {
    for (const table of tables) {
      expect(initialMigration).toContain(`create table public.${table}`)
    }
  })

  it('enables RLS and grants Data API access for every required table', () => {
    for (const table of tables) {
      expect(initialMigration).toContain(`alter table public.${table} enable row level security`)
      expect(initialMigration).toContain(
        `grant select, insert, update, delete on public.${table} to anon, service_role`
      )
    }
  })

  it('keeps no-auth anon policies explicit without always-true write expressions', () => {
    expect(policyMigration).toContain("using (auth.role() = 'anon')")
    expect(policyMigration).toContain("with check (auth.role() = 'anon')")
    expect(policyPerformanceMigration).toContain("using ((select auth.role()) = 'anon')")
    expect(policyPerformanceMigration).toContain("with check ((select auth.role()) = 'anon')")
    expect(policyMigration).not.toContain('using (true)')
    expect(policyMigration).not.toContain('with check (true)')
  })

  it('defines the required foreign keys and unique month constraints', () => {
    expect(migrations).toContain('month text not null unique')
    expect(migrations).toContain('budget_id text not null references public.monthly_budgets(id)')
    expect(migrations).toContain('category_id text not null references public.budget_categories(id)')
    expect(migrations).toContain('snapshot_id text not null references public.balance_snapshots(id)')
  })
})
