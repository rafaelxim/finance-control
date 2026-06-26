import { afterEach, describe, expect, it } from 'vitest'

import { DATA_EXPORT_SCHEMA_VERSION } from '@/domain/shared/data-export'
import { clearLocalData, exportLocalData, importLocalData } from '@/storage/data-export.repository'
import { setSupabaseClientForTests } from '@/storage/supabase/client'
import { createInMemorySupabaseClient } from '@tests/fixtures/supabase/client'

const timestamp = '2026-06-01T00:00:00.000Z'

describe('remote data export/import', () => {
  afterEach(() => setSupabaseClientForTests(null))

  it('round trips finance data through Supabase-backed JSON payloads', async () => {
    const { client, store } = createInMemorySupabaseClient({
      monthly_budgets: [
        {
          id: 'budget_1',
          month: '2026-06',
          available_amount: '1000.00',
          notes: null,
          status: 'active',
          created_at: timestamp,
          updated_at: timestamp
        }
      ],
      budget_categories: [
        {
          id: 'category_1',
          budget_id: 'budget_1',
          name: 'Comida',
          allocation_type: 'fixed',
          allocation_value: '300.00',
          computed_limit: '300.00',
          sort_order: 0,
          status: 'active',
          created_at: timestamp,
          updated_at: timestamp
        }
      ],
      visual_preferences: [
        {
          id: 'default',
          category_visuals: { category_1: 'green' },
          created_at: timestamp,
          updated_at: timestamp
        }
      ]
    })
    setSupabaseClientForTests(client)

    const payload = await exportLocalData()
    expect(payload.schemaVersion).toBe(DATA_EXPORT_SCHEMA_VERSION)
    expect(payload.monthlyBudgets).toHaveLength(1)
    expect(payload.budgetCategories).toHaveLength(1)

    await clearLocalData()
    expect(store.monthly_budgets).toHaveLength(0)

    const result = await importLocalData(JSON.parse(JSON.stringify(payload)))

    expect(result.errors).toEqual([])
    expect(store.monthly_budgets).toHaveLength(1)
    expect(store.budget_categories).toHaveLength(1)
    expect(store.visual_preferences).toHaveLength(1)
  })
})
