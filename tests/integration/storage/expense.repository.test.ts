import { afterEach, describe, expect, it } from 'vitest'

import {
  deleteExpense,
  getBudgetForExpenseMonth,
  getExpensesByBudgetId,
  getExpensesByMonth,
  saveExpense
} from '@/storage/expense.repository'
import { setSupabaseClientForTests } from '@/storage/supabase/client'
import { createInMemorySupabaseClient } from '@tests/fixtures/supabase/client'

const timestamp = '2026-06-01T00:00:00.000Z'

describe('expense remote repository', () => {
  afterEach(() => setSupabaseClientForTests(null))

  it('loads expenses by budget and month ordered by most recent date', async () => {
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
      expenses: [
        {
          id: 'expense_old',
          budget_id: 'budget_1',
          category_id: 'category_1',
          amount: '10.00',
          date: '2026-06-01',
          description: null,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          id: 'expense_new',
          budget_id: 'budget_1',
          category_id: 'category_1',
          amount: '20.00',
          date: '2026-06-10',
          description: 'Padaria',
          created_at: timestamp,
          updated_at: timestamp
        }
      ]
    })
    setSupabaseClientForTests(client)

    expect((await getBudgetForExpenseMonth('2026-06'))?.id).toBe('budget_1')
    expect((await getExpensesByBudgetId('budget_1')).map((expense) => expense.id)).toEqual([
      'expense_new',
      'expense_old'
    ])
    expect((await getExpensesByMonth('2026-06')).map((expense) => expense.id)).toEqual([
      'expense_new',
      'expense_old'
    ])
  })

  it('saves and deletes expenses', async () => {
    const { client, store } = createInMemorySupabaseClient()
    setSupabaseClientForTests(client)

    const expense = await saveExpense({
      budgetId: 'budget_1',
      categoryId: 'category_1',
      amount: '32.40',
      date: '2026-06-15',
      description: ' Feira '
    })
    expect(expense.description).toBe('Feira')
    expect(store.expenses).toHaveLength(1)

    await deleteExpense(expense.id)

    expect(store.expenses).toHaveLength(0)
  })
})
