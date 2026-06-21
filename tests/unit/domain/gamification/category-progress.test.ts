import { describe, expect, it } from 'vitest'

import type { BudgetCategory } from '@/domain/budget/types'
import type { Expense } from '@/domain/expenses/types'
import { calculateCategoryProgress } from '@/domain/gamification/category-progress'

const categoryBase = {
  id: 'category_food',
  budgetId: 'budget_1',
  name: 'Comida',
  allocationType: 'fixed' as const,
  allocationValue: '300.00',
  computedLimit: '300.00',
  sortOrder: 0,
  status: 'active' as const,
  createdAt: '2026-06-21T00:00:00.000Z',
  updatedAt: '2026-06-21T00:00:00.000Z'
} satisfies BudgetCategory

function expense(amount: string): Expense {
  return {
    id: `expense_${amount}`,
    budgetId: 'budget_1',
    categoryId: 'category_food',
    amount,
    date: '2026-06-21',
    createdAt: '2026-06-21T00:00:00.000Z',
    updatedAt: '2026-06-21T00:00:00.000Z'
  }
}

describe('category progress', () => {
  it('calculates safe remaining balance for category expenses', () => {
    const [progress] = calculateCategoryProgress([categoryBase], [expense('75.00')])

    expect(progress).toMatchObject({
      spent: '75.00',
      remaining: '225.00',
      usagePercent: '25.00',
      state: 'safe'
    })
  })

  it('moves categories through warning, limit reached, and over-limit states', () => {
    expect(calculateCategoryProgress([categoryBase], [expense('225.00')])[0].state).toBe('warning')
    expect(calculateCategoryProgress([categoryBase], [expense('300.00')])[0].state).toBe(
      'limitReached'
    )
    expect(calculateCategoryProgress([categoryBase], [expense('325.00')])[0]).toMatchObject({
      remaining: '-25.00',
      usagePercent: '108.33',
      state: 'overLimit'
    })
  })
})
