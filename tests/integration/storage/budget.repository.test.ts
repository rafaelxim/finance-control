import { afterEach, describe, expect, it } from 'vitest'

import { getBudgetByMonth, saveBudgetWithCategories } from '@/storage/budget.repository'
import { setSupabaseClientForTests } from '@/storage/supabase/client'
import { createInMemorySupabaseClient } from '@tests/fixtures/supabase/client'

const timestamp = '2026-06-01T00:00:00.000Z'

describe('budget remote repository', () => {
  afterEach(() => setSupabaseClientForTests(null))

  it('loads a monthly budget with categories ordered by sort order', async () => {
    const { client } = createInMemorySupabaseClient({
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
          id: 'category_2',
          budget_id: 'budget_1',
          name: 'Transporte',
          allocation_type: 'fixed',
          allocation_value: '100.00',
          computed_limit: '100.00',
          sort_order: 1,
          status: 'active',
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          id: 'category_1',
          budget_id: 'budget_1',
          name: 'Mercado',
          allocation_type: 'fixed',
          allocation_value: '400.00',
          computed_limit: '400.00',
          sort_order: 0,
          status: 'active',
          created_at: timestamp,
          updated_at: timestamp
        }
      ]
    })
    setSupabaseClientForTests(client)

    const result = await getBudgetByMonth('2026-06')

    expect(result.budget?.id).toBe('budget_1')
    expect(result.categories.map((category) => category.id)).toEqual(['category_1', 'category_2'])
  })

  it('saves updates and archives removed categories without deleting history', async () => {
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
          id: 'category_keep',
          budget_id: 'budget_1',
          name: 'Mercado',
          allocation_type: 'fixed',
          allocation_value: '400.00',
          computed_limit: '400.00',
          sort_order: 0,
          status: 'active',
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          id: 'category_archive',
          budget_id: 'budget_1',
          name: 'Lazer',
          allocation_type: 'fixed',
          allocation_value: '100.00',
          computed_limit: '100.00',
          sort_order: 1,
          status: 'active',
          created_at: timestamp,
          updated_at: timestamp
        }
      ]
    })
    setSupabaseClientForTests(client)

    const result = await saveBudgetWithCategories({
      month: '2026-06',
      availableAmount: '1200.00',
      categories: [
        {
          id: 'category_keep',
          name: 'Mercado',
          allocationType: 'percentage',
          allocationValue: '50.00'
        }
      ]
    })

    expect(result.budget.availableAmount).toBe('1200.00')
    expect(result.categories).toHaveLength(1)
    expect(store.budget_categories.find((category) => category.id === 'category_archive')?.status).toBe(
      'archived'
    )
  })
})
