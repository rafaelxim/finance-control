import { afterEach, describe, expect, it } from 'vitest'

import {
  migrateBackupToSupabase,
  validateBackupForMigration
} from '@/storage/supabase/backup-migration'
import { setSupabaseClientForTests } from '@/storage/supabase/client'
import { loadBackupPayload } from '@tests/fixtures/backup-payload'
import { createInMemorySupabaseClient } from '@tests/fixtures/supabase/client'

describe('backup migration to Supabase', () => {
  afterEach(() => setSupabaseClientForTests(null))

  it('validates backup.json schema and expected entity counts', () => {
    const payload = validateBackupForMigration(loadBackupPayload())

    expect(payload.schemaVersion).toBe(1)
    expect(payload.monthlyBudgets).toHaveLength(3)
    expect(payload.budgetCategories).toHaveLength(16)
    expect(payload.expenses).toHaveLength(7)
    expect(payload.balanceSnapshots).toHaveLength(2)
    expect(payload.balanceItems).toHaveLength(6)
  })

  it('runs idempotently without duplicating rows', async () => {
    const payload = loadBackupPayload()
    const { client, store } = createInMemorySupabaseClient()
    setSupabaseClientForTests(client)

    await migrateBackupToSupabase(payload)
    const result = await migrateBackupToSupabase(payload)

    expect(result.counts).toEqual({
      monthlyBudgets: 3,
      budgetCategories: 16,
      expenses: 7,
      balanceSnapshots: 2,
      balanceItems: 6
    })
    expect(store.monthly_budgets).toHaveLength(3)
    expect(store.budget_categories).toHaveLength(16)
    expect(store.expenses).toHaveLength(7)
  })

  it('rejects missing budget, category, and snapshot references before writing', async () => {
    const payload = loadBackupPayload()
    const { client, store } = createInMemorySupabaseClient()
    setSupabaseClientForTests(client)

    await expect(
      migrateBackupToSupabase({
        ...payload,
        budgetCategories: [{ ...payload.budgetCategories[0], budgetId: 'missing_budget' }],
        expenses: [{ ...payload.expenses[0], categoryId: 'missing_category' }],
        balanceItems: [{ ...payload.balanceItems[0], snapshotId: 'missing_snapshot' }]
      })
    ).rejects.toThrow(/referencia/)

    expect(store.monthly_budgets).toHaveLength(0)
  })
})
