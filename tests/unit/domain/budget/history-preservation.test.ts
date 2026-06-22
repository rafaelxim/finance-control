import { describe, expect, it } from 'vitest'

import { archiveCategoryForHistory, createHistoricalBudgetCopy } from '@/domain/budget/history'
import type { BudgetCategory } from '@/domain/budget/types'

const category: BudgetCategory = {
  id: 'category_food',
  budgetId: 'budget_2026_05',
  name: 'Comida',
  allocationType: 'fixed',
  allocationValue: '300.00',
  computedLimit: '300.00',
  sortOrder: 0,
  status: 'active',
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z'
}

describe('budget history preservation', () => {
  it('copies categories to a new month without reusing historical category ids', () => {
    const [copy] = createHistoricalBudgetCopy([category])

    expect(copy).toEqual({
      name: 'Comida',
      allocationType: 'fixed',
      allocationValue: '300.00'
    })
  })

  it('archives historical categories instead of mutating their financial values', () => {
    const archived = archiveCategoryForHistory(category)

    expect(archived).toMatchObject({
      id: category.id,
      computedLimit: '300.00',
      status: 'archived'
    })
  })
})
